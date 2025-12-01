# expo-file-system-legacy-bundled-pr-verification

This repository demonstrates and validates the **Legacy API** documentation updates proposed in **[Expo PR #41272](https://github.com/expo/expo/pull/41272)**.

Specifically, it verifies the behavior of `FileSystem.bundleDirectory` (Legacy) and the requirement to copy files out of the bundle on iOS before reading them.

---

## 1. Clone & Install

```bash
git clone https://github.com/dileepapeiris/expo-file-system-legacy-bundled-pr-verification.git
cd expo-file-system-legacy-bundled-pr-verification
npm install
```

---

## 2. Generate Native Projects

Before adding custom assets to the native bundles, we must generate the native folders (`android` and `ios`).

```bash
npx expo prebuild
```

> **Note:** Run this *before* the setup below. Running `prebuild` again later may overwrite manual changes (specifically the iOS Xcode configuration).

---

## 3. Prepare Native Projects

The code attempts to read `example.txt` from the **native bundle**. This file must be manually placed in the native project structure.

### Android Setup
**Goal:** Place the file in `android/app/src/main/assets/`.

1.  If the assets folder does not exist, create it:
    ```bash
    mkdir -p android/app/src/main/assets
    ```

2.  Copy the example file (ensure you have an `example.txt` file in your root or source folder):
    ```bash
    # Example command
    cp example.txt android/app/src/main/assets/
    ```

### iOS Setup
**Goal:** Add the file to the "Copy Bundle Resources" build phase in Xcode.

1.  Open the iOS project workspace:
    ```bash
    xed ios
    ```

2.  In Xcode:
    1.  Go to **Project Navigator** -> **YourApp** (Root) -> **Target** (YourApp).
    2.  Select the **Build Phases** tab.
    3.  Expand **Copy Bundle Resources**.
    4.  Drag `example.txt` (from Finder) into this list.
    5.  *Ensure "Copy items if needed" is checked.*

---

## 4. Running the App

```bash
# Terminal 1
npx expo run:android

# Terminal 2
npx expo run:ios
```

---

## 5. Test Logic (Legacy API)

This app uses `expo-file-system/legacy`. It verifies that files in the bundle cannot be read directly on iOS and must be copied first.

**Code Logic Verified:**

```ts
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const readNativeFile = async () => {
  const fileName = "example.txt";
  const bundleFile = FileSystem.bundleDirectory + fileName;

  // 1. Check existence in bundle
  const fileInfo = await FileSystem.getInfoAsync(bundleFile);
  if (!fileInfo.exists) return;

  let fileToRead = bundleFile;

  // 2. Platform Specifics
  if (Platform.OS === "ios") {
    // iOS Bundle is Read-Only. Must copy to DocumentDirectory.
    const destFile = FileSystem.documentDirectory + fileName;
    
    await FileSystem.copyAsync({
      from: bundleFile,
      to: destFile,
    });
    
    fileToRead = destFile;
  }

  // 3. Read File
  const content = await FileSystem.readAsStringAsync(fileToRead);
  console.log(content);
};
```

---

## 6. Screen Recordings

The following recordings demonstrate the app successfully detecting the platform, handling the file copy (on iOS), and reading the content.

| Platform | Recording |
| :--- | :--- |
| **Android** | <video src="https://github.com/user-attachments/assets/8b67eca5-4896-4b5e-a63e-129bd50a4aa3" controls width="380"></video> |
| **iOS** | <video src="https://github.com/user-attachments/assets/8234cc5f-3969-42d3-8b12-a34b4b4c3b12" controls width="380"></video> |

---



## 7. Verification Checklist

- [x] **Android:** App logs "Android detected — reading directly from bundle".
- [x] **iOS:** App logs "iOS detected — copying file out of bundle".
- [x] **Both:** Final log shows "File read successfully!" with the text content.

### Conclusion
This setup validates the documentation changes for `filesystemlegacy.mdx`, confirming that:
1. `FileSystem.bundleDirectory` correctly points to the native bundle.
2. iOS requires a copy operation due to sandboxing/read-only restrictions.
