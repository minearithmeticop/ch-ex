# 🖱️ Smart Auto Clicker - Chrome Extension

**Auto click elements on web pages with intelligent anti-bot detection!**

## ✨ Features

### 🎯 **Smart Element Selection**
- Visual element picker with real-time highlighting
- Click any element on the page to select it
- Generates unique CSS selector and XPath automatically
- Works with dynamic elements

### ⏱️ **Flexible Click Modes**

#### 1. Fixed Interval Mode
- Click every X milliseconds
- Precise timing control
- Perfect for consistent automation

#### 2. Random Interval Mode 🎲
- Randomize delay between clicks
- Set min and max interval
- **Avoids bot detection systems!**
- Mimics human behavior

### 📊 **Real-time Statistics**
- Total click count
- Running time tracker
- Live status updates

### 🎨 **Beautiful UI**
- Modern gradient design
- Intuitive controls
- Visual feedback on clicks
- Status indicators

---

## 🚀 Installation

### Method 1: Load Unpacked Extension

1. **Download** this folder: `auto-clicker-extension`

2. **Open Chrome Extensions**:
   ```
   chrome://extensions
   ```

3. **Enable Developer Mode**:
   - Toggle switch in top-right corner

4. **Load Extension**:
   - Click "Load unpacked"
   - Select `auto-clicker-extension` folder

5. **Done!** 🎉
   - Extension icon appears in toolbar

---

## 📖 How to Use

### Step 1: Select Target Element

1. Navigate to the web page
2. Click extension icon
3. Click **"🎯 Select Element to Click"**
4. Your cursor becomes a crosshair
5. Hover over elements (they highlight in gold)
6. Click the element you want to auto-click
7. Press **ESC** to cancel selection

### Step 2: Configure Click Mode

#### Fixed Interval:
```
⏱️ Fixed Interval
Interval: 1000 ms (1 second)
```

#### Random Interval (Anti-Bot):
```
🎲 Random Interval
Min: 800 ms
Max: 2000 ms
```
Clicks will occur at random intervals between 800-2000ms

### Step 3: Start Auto Clicking

1. Click **"▶️ Start Auto Clicking"**
2. Watch the statistics update in real-time
3. Element flashes green on each click
4. Click **"⏸️ Stop"** to pause

### Step 4: Reset (Optional)

Click **"🔄 Reset"** to:
- Stop clicking
- Clear statistics
- Select a new element

---

## 🎮 Use Cases

### 1. **Gaming**
- Auto-click collect buttons
- Farming resources
- Repetitive tasks

### 2. **Testing**
- Stress test click handlers
- Test button functionality
- Automated UI testing

### 3. **Productivity**
- Auto-refresh pages
- Click through repetitive forms
- Automation scripts

### 4. **Anti-Bot Evasion** 🎲
- Use Random Interval mode
- Mimics human clicking patterns
- Bypasses simple bot detection

---

## ⚙️ Configuration Options

| Setting | Description | Default | Range |
|---------|-------------|---------|-------|
| **Fixed Interval** | Click every X ms | 1000 ms | 100-60000 ms |
| **Random Min** | Minimum delay | 800 ms | 100-60000 ms |
| **Random Max** | Maximum delay | 2000 ms | 100-60000 ms |

### Recommended Settings

**Fast Clicking** (with bot protection):
```
Mode: Random
Min: 200 ms
Max: 500 ms
```

**Normal Clicking** (human-like):
```
Mode: Random
Min: 800 ms
Max: 2000 ms
```

**Slow & Safe** (maximum stealth):
```
Mode: Random
Min: 2000 ms
Max: 5000 ms
```

**Precise Timing**:
```
Mode: Fixed
Interval: 1000 ms
```

---

## 🔧 Technical Details

### How It Works

1. **Element Selection**:
   - Uses `document.elementFromPoint()` for real-time element detection
   - Generates unique CSS selector or XPath
   - Stores element reference for clicking

2. **Auto Clicking**:
   - Uses `MouseEvent` with `dispatchEvent()`
   - **No actual mouse movement required!**
   - Works with hidden/off-screen elements
   - Bubbles events properly

3. **Anti-Bot Random Mode**:
   - `Math.random()` generates delay
   - Different interval for each click
   - Unpredictable timing pattern

### Element Finding Strategy

1. Try CSS selector first
2. Fallback to XPath if selector fails
3. Alert user if element disappears

### Click Event Properties

```javascript
{
  view: window,
  bubbles: true,      // Event bubbles up DOM
  cancelable: true,   // Can be cancelled
  buttons: 1          // Left mouse button
}
```

---

## 🛡️ Safety & Ethics

### ⚠️ Important Notes

1. **Use Responsibly**
   - Don't abuse websites
   - Respect rate limits
   - Follow Terms of Service

2. **Not for Malicious Use**
   - Don't spam servers
   - Don't bypass security measures
   - Don't harm others

3. **Bot Detection**
   - Random mode helps avoid simple detection
   - Advanced systems may still detect automation
   - Use at your own risk

4. **Page Changes**
   - If element is removed, clicking stops
   - Re-select element if page updates
   - Dynamic SPAs may need re-selection

---

## 🐛 Troubleshooting

### Problem: "Element not found" error

**Solution**:
- Element was removed from page
- Click **Reset** and select element again
- Make sure element still exists

### Problem: Clicks don't work

**Solution**:
- Some sites use custom event handlers
- Try selecting parent element
- Check browser console for errors

### Problem: Extension doesn't appear

**Solution**:
- Refresh page after installing extension
- Check if Developer Mode is enabled
- Reload extension in `chrome://extensions`

### Problem: Selection mode doesn't start

**Solution**:
- Refresh the page
- Check extension permissions
- Look for errors in console

---

## 📊 Statistics

The extension tracks:

- **Total Clicks**: Number of clicks performed
- **Running Time**: How long auto-clicking has been active
- **Average Rate**: Clicks per second (calculated from total)

---

## 🎨 Customization

### Change Click Visual Feedback

Edit in `content.js`:
```javascript
element.style.border = '3px solid #YOUR_COLOR';
element.style.background = 'rgba(R, G, B, 0.2)';
```

### Change UI Colors

Edit in `popup.html`:
```css
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

---

## 🔒 Privacy

- **No data collection**
- **No external requests**
- **No tracking**
- **Open source code**
- **Runs locally only**

All data stays in your browser!

---

## 📝 Permissions Explained

| Permission | Why Needed |
|------------|------------|
| `activeTab` | Access current tab to click elements |
| `scripting` | Inject content script for element selection |
| `storage` | Save settings (mode, intervals) |

---

## 🚀 Advanced Usage

### Keyboard Shortcuts (Future)
- `Ctrl+Shift+C`: Start selection
- `Ctrl+Shift+S`: Start/Stop clicking
- `Ctrl+Shift+R`: Reset

### Multiple Elements (Future)
- Queue multiple elements
- Click in sequence
- Random element selection

### Click Patterns (Future)
- Double-click support
- Right-click support
- Drag and drop

---

## 💡 Tips & Tricks

1. **Use Random Mode** for longer sessions
2. **Test with longer intervals** first
3. **Monitor the page** for unexpected changes
4. **Save your settings** - they persist between uses
5. **Use ESC** to cancel element selection quickly

---

## 🤝 Contributing

Want to improve this extension?

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📜 License

MIT License - Free to use and modify!

---

## 🙏 Credits

Created with ❤️ for automation enthusiasts

**Version**: 1.0.0  
**Last Updated**: October 2025

---

## 📞 Support

Having issues? Check:
1. This README
2. Browser console (F12)
3. Extension console (Inspect popup)

---

**Happy Auto Clicking! 🖱️✨**

Remember: With great power comes great responsibility! 🕷️
