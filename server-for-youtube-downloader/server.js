const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec');
const sanitize = require('sanitize-filename');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Create temp directory
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// Clean old files on startup
cleanTempDirectory();

// Helper function to encode filename for Content-Disposition header
function encodeFilename(filename) {
  // Remove or replace problematic characters
  // Replace quotes, backslashes, and other special chars
  let safe = filename
    .replace(/['"\\]/g, '') // Remove quotes and backslashes
    .replace(/[^\x20-\x7E]/g, '_') // Replace non-ASCII with underscore
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .substring(0, 200); // Limit length
  
  return safe;
}

// Helper function to create safe Content-Disposition header
function createContentDisposition(filename) {
  const safeFilename = encodeFilename(filename);
  const encodedFilename = encodeURIComponent(filename);
  
  // Use both filename and filename* (RFC 5987)
  // filename* supports UTF-8 encoding
  return `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`;
}

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Check if yt-dlp is installed
    const version = await youtubedl('--version');
    res.json({
      status: 'ok',
      ytdlp: version.toString().trim(),
      message: 'Server is running'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'yt-dlp not installed. Run: pip install yt-dlp',
      error: error.message
    });
  }
});

// Get video info
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.includes('youtube.com')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log('📥 Getting video info:', url);

    // Clean URL - remove playlist parameters
    const cleanUrl = url.split('&list=')[0].split('?list=')[0];
    console.log('🔗 Clean URL:', cleanUrl);

    // Get video info using yt-dlp
    const info = await youtubedl(cleanUrl, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      noPlaylist: true,          // Don't download playlist, just single video
      preferFreeFormats: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    // Check if info is valid
    if (!info) {
      console.error('❌ No info received from yt-dlp');
      throw new Error('Failed to retrieve video information');
    }

    // Debug: log what we got
    console.log('📦 Info object keys:', Object.keys(info));
    
    // Check if formats exist
    if (!info.formats || !Array.isArray(info.formats)) {
      console.error('❌ Invalid video info:', {
        hasInfo: !!info,
        hasFormats: !!info?.formats,
        isArray: Array.isArray(info?.formats),
        formatType: typeof info?.formats
      });
      
      // Try to log first 500 chars of info for debugging
      console.log('📝 Info sample:', JSON.stringify(info).substring(0, 500));
      
      // Use fallback - create formats manually
      console.log('⚠️ Using fallback formats');
      info.formats = [
        { height: 144, vcodec: 'avc1', acodec: 'mp4a', ext: 'mp4', format_id: 'best' },
        { height: 240, vcodec: 'avc1', acodec: 'mp4a', ext: 'mp4', format_id: 'best' },
        { height: 360, vcodec: 'avc1', acodec: 'mp4a', ext: 'mp4', format_id: 'best' },
        { height: 480, vcodec: 'avc1', acodec: 'mp4a', ext: 'mp4', format_id: 'best' },
        { height: 720, vcodec: 'avc1', acodec: 'mp4a', ext: 'mp4', format_id: 'best' },
        { height: 1080, vcodec: 'avc1', acodec: 'mp4a', ext: 'mp4', format_id: 'best' }
      ];
    }

    console.log(`📊 Found ${info.formats.length} formats`);

    // Extract available formats with safety checks
    const formats = info.formats
      .filter(f => f && f.vcodec !== 'none' && f.acodec !== 'none') // มี video + audio
      .map(f => ({
        quality: f.height ? `${f.height}p` : 'unknown',
        format_id: f.format_id || 'unknown',
        ext: f.ext || 'mp4',
        filesize: f.filesize || null,
        fps: f.fps || null
      }))
      .filter(f => f.quality !== 'unknown')
      .sort((a, b) => parseInt(b.quality) - parseInt(a.quality));

    console.log(`✅ Filtered to ${formats.length} video+audio formats`);

    // If no combined formats found, provide common qualities
    if (formats.length === 0) {
      console.log('⚠️ No combined formats found, using fallback qualities');
      const fallbackQualities = ['144', '240', '360', '480', '720', '1080'];
      formats.push(...fallbackQualities.map(q => ({
        quality: `${q}p`,
        format_id: 'best',
        ext: 'mp4',
        filesize: null,
        fps: null
      })));
    }

    // Remove duplicates
    const uniqueFormats = Array.from(
      new Map(formats.map(f => [f.quality, f])).values()
    );

    const response = {
      title: info.title || 'Unknown Title',
      thumbnail: info.thumbnail || '',
      duration: info.duration || 0,
      channel: info.uploader || info.channel || 'Unknown',
      formats: uniqueFormats,
      video_id: info.id || ''
    };

    console.log('✅ Video info retrieved:', {
      title: response.title,
      formats: response.formats.length
    });
    res.json(response);

  } catch (error) {
    console.error('❌ Error getting video info:', error.message);
    res.status(500).json({
      error: 'Failed to get video info',
      message: error.message
    });
  }
});

// Download video
app.post('/api/download', async (req, res) => {
  try {
    const { url, quality, format = 'mp4' } = req.body;

    if (!url || !url.includes('youtube.com')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`📥 Downloading: ${url} (${quality})`);

    // Get video info first for title
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true
    });

    const videoTitle = sanitize(info.title);
    const baseFilename = `${videoTitle}_${quality}`;
    const outputPath = path.join(TEMP_DIR, baseFilename);

    // Download video as single file (no merge needed - works without ffmpeg)
    // Use 'best' format that already has video+audio combined
    const height = parseInt(quality);
    const formatString = `best[height<=${height}]/bestvideo[height<=${height}]+bestaudio/best`;

    await youtubedl(url, {
      output: outputPath + '.%(ext)s',
      format: formatString,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    console.log('✅ Download complete');

    // Find the actual downloaded file (look for normal extensions, not format codes)
    const files = fs.readdirSync(TEMP_DIR);
    
    // Filter files that match baseFilename and have normal video extensions
    const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi'];
    let downloadedFile = files.find(f => {
      const nameWithoutExt = f.replace(/\.[^/.]+$/, '');
      const ext = path.extname(f).toLowerCase();
      return nameWithoutExt === baseFilename && videoExtensions.includes(ext);
    });

    // If not found, try to find any file that starts with baseFilename
    if (!downloadedFile) {
      downloadedFile = files.find(f => f.startsWith(baseFilename));
    }

    if (!downloadedFile) {
      console.error('❌ File not found. Looking for:', baseFilename);
      console.error('📁 Available files:', files);
      throw new Error('Downloaded file not found');
    }

    const filepath = path.join(TEMP_DIR, downloadedFile);
    const filename = downloadedFile;
    console.log(`📁 Found file: ${downloadedFile}`);

    // Determine content type from actual extension
    const ext = path.extname(downloadedFile).toLowerCase();
    const contentTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska',
      '.avi': 'video/x-msvideo'
    };
    const contentType = contentTypes[ext] || 'video/mp4';

    // Set headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', createContentDisposition(filename));
    res.setHeader('Content-Length', fs.statSync(filepath).size);

    // Stream file to client
    const fileStream = fs.createReadStream(filepath);
    
    fileStream.pipe(res);

    // Delete file after sending
    fileStream.on('end', () => {
      setTimeout(() => {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log('🗑️  Temp file deleted');
        }
      }, 1000);
    });

  } catch (error) {
    console.error('❌ Download error:', error.message);
    res.status(500).json({
      error: 'Download failed',
      message: error.message
    });
  }
});

// Download audio only (MP3)
app.post('/api/download-audio', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.includes('youtube.com')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`🎵 Downloading audio: ${url}`);

    // Get video info
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true
    });

    const audioTitle = sanitize(info.title);
    const baseFilename = `${audioTitle}`;
    const outputPath = path.join(TEMP_DIR, baseFilename);

    // Download best audio and convert to MP3 using postprocessors
    console.log('📥 Downloading and converting to MP3...');
    await youtubedl(url, {
      output: outputPath + '.%(ext)s',
      format: 'bestaudio',
      postprocessorArgs: [
        '-ar', '44100',    // 44.1kHz sample rate
        '-ac', '2',        // Stereo
        '-b:a', '192k'     // 192kbps bitrate
      ],
      extractAudio: true,
      audioFormat: 'mp3',
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ['referer:youtube.com', 'user-agent:googlebot']
    });

    console.log('✅ Audio download complete');

    // Find the actual downloaded/converted file
    const files = fs.readdirSync(TEMP_DIR);
    const downloadedFile = files.find(f => {
      const nameWithoutExt = f.replace(/\.[^/.]+$/, '');
      return nameWithoutExt === baseFilename && f.endsWith('.mp3');
    });

    if (!downloadedFile) {
      console.error('❌ MP3 file not found. Looking for:', baseFilename + '.mp3');
      console.error('📁 Available files:', files);
      
      // Try to find any file with the base filename
      const anyFile = files.find(f => {
        const nameWithoutExt = f.replace(/\.[^/.]+$/, '');
        return nameWithoutExt === baseFilename;
      });
      
      if (anyFile) {
        console.log('📁 Found alternative file:', anyFile);
        const filepath = path.join(TEMP_DIR, anyFile);
        const ext = path.extname(anyFile).toLowerCase();
        const contentTypes = {
          '.mp3': 'audio/mpeg',
          '.m4a': 'audio/mp4',
          '.webm': 'audio/webm',
          '.opus': 'audio/opus'
        };
        const contentType = contentTypes[ext] || 'audio/mpeg';
        const responseFilename = anyFile;
        
        // Use the file we found
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', createContentDisposition(responseFilename));
        res.setHeader('Content-Length', fs.statSync(filepath).size);
        
        const fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);
        
        fileStream.on('end', () => {
          setTimeout(() => {
            if (fs.existsSync(filepath)) {
              fs.unlinkSync(filepath);
              console.log('🗑️  Temp file deleted');
            }
          }, 1000);
        });
        return;
      }
      
      throw new Error('Audio file not found after download');
    }

    const filepath = path.join(TEMP_DIR, downloadedFile);
    console.log(`📁 MP3 file ready: ${downloadedFile}`);

    // MP3 content type
    const contentType = 'audio/mpeg';

    // Use MP3 filename
    const responseFilename = downloadedFile;

    // Stream file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', createContentDisposition(responseFilename));
    res.setHeader('Content-Length', fs.statSync(filepath).size);

    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

    // Delete after sending
    fileStream.on('end', () => {
      setTimeout(() => {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log('🗑️  Temp audio file deleted');
        }
      }, 1000);
    });

  } catch (error) {
    console.error('❌ Audio download error:', error.message);
    res.status(500).json({
      error: 'Audio download failed',
      message: error.message
    });
  }
});

// Clean temp directory (delete files older than 1 hour)
function cleanTempDirectory() {
  try {
    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    files.forEach(file => {
      const filepath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filepath);
      
      if (now - stats.mtimeMs > oneHour) {
        fs.unlinkSync(filepath);
        console.log(`🗑️  Cleaned old file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning temp directory:', error);
  }
}

// Clean temp directory every hour
setInterval(cleanTempDirectory, 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 YouTube Downloader Server');
  console.log('================================');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log('\n💡 Make sure yt-dlp is installed:');
  console.log('   pip install yt-dlp');
  console.log('\n✨ Ready to accept requests from Extension!\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  cleanTempDirectory();
  process.exit(0);
});
