## 3.2.10

- Avoid reset of the socket handler

## 3.2.9

- Bug fix and performance , for multi rider management
- added flag isalready mounted for avoid the "double mouting" of the same rider

## 3.2.8

- Bug fixing module.json

## 3.2.7

- Auto update of the elevation parameter of the rider when mount and dismount, so the elevation of the rider is always syn with the elevation of the mount useful for flying mount with levels.
- New active effect management for add and remove custom active effect when mount and dismount, you mount a tank ? you got some active effect on the defense !
- Add token magic effect for apply the "flying" effect, for when a mount is set to be a flying one "just a token amgic effect"
- Set up for the new token attacher parameters for the mount up macro "Add _canMoveConstrained_ flag and API to set this flag so a attached element is allowed to move within area of base token. This is only supported for Tokens for now."
- Abbandoned support for 0.8.9

## 3.2.5 

- Removed old flag set
- Better center calculation coordinates

## 3.2.4

- Fix [Question/Feedback Request: How does one center the rider on the mount?](https://github.com/p4535992/MountUp/issues/6)
- Fix [[BUG] Blank messages are sent on mount/dismount](https://github.com/p4535992/MountUp/issues/5)
- Fix [[BUG] MountUp's action button nonfunctional & doesn't render](https://github.com/p4535992/MountUp/issues/4)

## 3.2.3

- Add toggleMount function to the macros:This change will allow users to easily mount and dismount the same rider/mount pair with a single macro.

## 3.2.2

- Rewrite and clean up the code
- Added [token-z](https://github.com/theripper93/token-z) as dependency

## 3.2.1 [PATCHED VERSION]

- Fix settings are not saved ????
- Fix [[BUG] Settings aren't saving at all. #1](https://github.com/p4535992/MountUp/issues/1)
- Fix [[BUG] Most Settings Not Respected](https://github.com/p4535992/MountUp/issues/2)
- Fix [MountUp! not recognised in game](https://github.com/p4535992/MountUp/issues/3)

## 3.2.0

- Upgrade for 0.8.9 and preparation for 0.9.X
- Many buug fix
- Some perormance check

## 3.1.5

- Bug fix about a error while trying to open the module settings (TODO SOME CHECK WITH TYPESCRIPT)
- Update lib-wrapper

## 3.1.4

- Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types)

## 3.1.3

- Many bug fixes and patches, but still remain some
- Bug fix - When mount token of the same size (medium for example) and the number of riders is more than 1, when you de-mount the riders all togheter the last one remain "small"
- Bug fix - When mount token of the same size (medium for example), if you try to drop the single rider (rigth click on the rider not the mount)m the rider turn back to normal but hide the mount token

## 3.1.2

- Many bug fixes and patches, but still remain some

## 3.1.1

- Forgot some flags to set

## 3.1.0

- Converted to typescript
- Direct integration with the module 'token-attacher'
- Minor bug fix 
- Preparation to foundryvtt 0.8.0
- Update documentation

## 3.0.1
- Fix for rider rotation not returning to zero when mount does
- Fix for rider being dismounted if being moved with mount while 'dismount while outside rider bounds' is enabled
- Fix logo not displaying properly in settings window


## 3.0.0
- NEW: Multiple riders per mount!
- New Settings options for rider lock:
    - No lock - do nothing when rider moves off mount
    - Lock to location - rider cannot move at all without mount (current version of rider lock)
    - Lock to mount bounds - rider is free to move about while inside the mount bounds, but cannot move out.
    - Dismount when outside mount bounds - if rider is moved off the mount, it will be dismounted
- Unless locked by 'rider lock', riders are free to move about their mounts and that positioning will be remmebered when the mount is moved
- HUD Buttons now have tooltips to help you better understand the effect of clicking it
- To mount:
    - Select 2 or more tokens and right click on the 'mount' token and click the mount Buttons
    - You can mount multiple riders all at once, or one at a time
- To Dismount:
    - Select a mount - clicking the dismount button will drop all riders for that mount *check tooltips*
    - Select a rider - clicking the dismount button will dismount only that rider *check tooltips*
- Use Webpack to significantly reduce module size


## 2.5.0
- New Setting: "Rider Rotation" allows for riders to match their rotation to the mount's rotation
- Moved all settings for Mount Up! into their own settings window.

## 2.4.2
- Fix for error message on other players' instance when a mount is moved due to no permissinos to set flags on unowned tokens

## 2.4.1
- Fix for rider location on fresh install or upgrade

## 2.4.0
- New settings to configure where the rider should be placed on the mount:
	- Options for horizontal are "Left", "Center", and "Right"
	- Options for vertical are "Top", "Center", and "Bottom"
- Fix for rider lock warning when dismounting if rider lock is enabled


## 2.3.0
- New setting allowing for riders to be locked to their mounts until dismounted
	- If enabled, this will prevent rider tokens from moving off of their mount, but they will still move with the mount

## 2.2.0
- Players can now move tokens unowned by them if they are mounted to a token they own
- Added macro support for common operations:
	- Mounting
	- Dismounting
	- Dropping a rider from a mount
- Added 2 new settings:
	- HUD Column: Define if you want the Mount Up button to appear on the left or right column in the HUD
	- HUD Top/Bottom: Define if you want the Mount Up button to appear on the top or bottom of the column in the HUD

## 2.1.0
- Fix for FVTT 0.5.7 hotfix changes

# 2.0.1
- Ensure compatibility with 0.5.6

## 2.0
- Significant rewrite to how ride links are stored
	- No longer requires sockets or game settings
	- Should eliminate multiple issues experienced due to permission issues

## 1.2.1
- Fixes the text for the settings hints
- Fixed the error message during module init

## 1.2
- Fixed permission issues by handling ride creation on GM side via socket
- Better handling of ancestor interactions (you should now longer be able to have a rider be mounted by its own mount)

## 1.1
- Fixed dismount chat message sending mount as rider and rider as mount

## 1.0
- Initial Release!
