#!/usr/bin/env python3
"""
Automated Screenshot Generator for Tailwind Components
This script generates high-quality screenshots of HTML components using Selenium WebDriver.
"""

import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from PIL import Image
import io

def setup_driver():
    """Setup Chrome WebDriver with optimal settings for screenshots."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")  # High resolution
    chrome_options.add_argument("--force-device-scale-factor=2")  # Retina quality
    chrome_options.add_argument("--hide-scrollbars")
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--disable-features=VizDisplayCompositor")
    
    # Set user agent for consistency
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    # Use ChromeDriverManager to automatically download and manage the driver
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def capture_component_screenshot(html_file_path, output_path, component_name):
    """Capture a screenshot of a Tailwind component."""
    driver = setup_driver()
    
    try:
        # Load the HTML file
        file_url = f"file://{os.path.abspath(html_file_path)}"
        driver.get(file_url)
        
        # Wait for the page to load completely
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Additional wait for animations and dynamic content
        time.sleep(3)
        
        # Execute JavaScript to ensure everything is loaded
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(1)
        
        # Get the full page dimensions
        total_height = driver.execute_script("return document.body.scrollHeight")
        viewport_height = driver.execute_script("return window.innerHeight")
        
        # Set appropriate viewport size
        if total_height > viewport_height:
            driver.set_window_size(1920, min(total_height + 100, 3000))
        
        time.sleep(2)  # Wait for resize
        
        # Take screenshot
        screenshot = driver.get_screenshot_as_png()
        
        # Process image with PIL for better quality
        image = Image.open(io.BytesIO(screenshot))
        
        # Optimize for web (reduce file size while maintaining quality)
        image = image.convert('RGB')
        
        # Save with high quality
        image.save(output_path, 'PNG', optimize=True, quality=95)
        
        print(f"✅ Screenshot saved: {output_path}")
        
    except Exception as e:
        print(f"❌ Error capturing screenshot for {component_name}: {str(e)}")
    
    finally:
        driver.quit()

def generate_screenshots(year="2025", component_names=None):
    """
    Generate screenshots for Tailwind components.
    
    Args:
        year: The year folder to scan (default: "2025")
        component_names: Optional list of specific component names to generate.
                        If None, generates for all components in the year folder.
    """
    base_path = f"src/content/tailwind-components/{year}"
    
    # If no specific components provided, scan all directories
    if component_names is None:
        if not os.path.exists(base_path):
            print(f"❌ Path not found: {base_path}")
            return
        
        # Get all component directories
        component_names = [
            d for d in os.listdir(base_path)
            if os.path.isdir(os.path.join(base_path, d)) and not d.startswith('.')
        ]
        
        if not component_names:
            print(f"❌ No components found in {base_path}")
            return
        
        print(f"📁 Found {len(component_names)} components in {year}:")
        for name in component_names:
            print(f"   - {name}")
        print()
    
    # Generate screenshots for each component
    for component_name in component_names:
        html_path = os.path.join(base_path, component_name, "code", "index.html")
        image_path = os.path.join(base_path, component_name, "images", f"tailwind-component-{component_name}.png")
        
        # Check if HTML file exists
        if not os.path.exists(html_path):
            print(f"⚠️  Skipping {component_name}: HTML file not found")
            continue
        
        # Skip if screenshot already exists
        if os.path.exists(image_path):
            print(f"⏭️  Skipping {component_name}: Screenshot already exists")
            continue
        
        # Create images directory if it doesn't exist
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        
        # Convert component name to title
        title = component_name.replace('-', ' ').title()
        
        print(f"📸 Generating screenshot for {title}...")
        capture_component_screenshot(html_path, image_path, title)

if __name__ == "__main__":
    import sys
    
    print("🚀 Starting automated screenshot generation...")
    print("📋 This will generate high-quality screenshots for Tailwind components")
    print("⏱️  Please wait while we capture the screenshots...\n")
    
    try:
        # You can specify year and/or specific components as command line arguments
        # Usage: python3 screenshot_generator.py [year] [component1] [component2] ...
        # Example: python3 screenshot_generator.py 2025 modern-contact-form
        # Example: python3 screenshot_generator.py 2025  (all components in 2025)
        
        year = sys.argv[1] if len(sys.argv) > 1 else "2025"
        component_names = sys.argv[2:] if len(sys.argv) > 2 else None
        
        generate_screenshots(year=year, component_names=component_names)
        
        print("\n✨ Screenshot generation completed!")
        print("🎯 All component images have been saved to their respective directories")
    except Exception as e:
        print(f"\n❌ An error occurred: {str(e)}")
        print("💡 Make sure you have Chrome and ChromeDriver installed")
        print("💡 Install requirements: pip install selenium pillow webdriver-manager")
        import traceback
        traceback.print_exc()