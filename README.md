# Geano's Secret Rolls

**Geano's Secret Rolls** is a Foundry VTT module that adds a true "Secret Roll" option to the roll mode menu.

Unlike the standard "Blind GM Roll" (which hides results from everyone but uses a placeholder card) or "Private GM Roll" (which shows a gray box to players), a **Secret Roll** is completely invisible to all other players. It appears **only** to the person who rolled it and the Game Masters.

## Features

- **New Roll Mode**: Adds "Secret Roll" to the chat roll mode dropdown.
- **True Invisibility**: 
  - **Roller**: Sees the full roll result (dice, banners, cards).
  - **GM**: Sees the full roll result.
  - **Others**: See **NOTHING**. No "Unknown Roll" card, no "Something happened" notification, no sound. It is as if the roll never happened.
- **System Compatibility**: Works by intercepting the roll and converting it into a private "Ghost Message", ensuring that even complex systems like D&D 5e or Pathfinder do not accidentally leak information via "Unknown Roll" cards.

## How to Use

1.  Select **Secret Roll** from the roll mode dropdown at the bottom of the chat log.
2.  Make your roll (attack, ability check, or `/r 1d20`).
3.  The result will be whispered to you and all GMs.

## Technical Details

This module uses a "Ghost Roll" technique:
1.  It intercepts the `preCreateChatMessage` hook.
2.  If the mode is "Secret", it **cancels** the original system message.
3.  It manually renders the system's chat card and dice HTML.
4.  It creates a new, purely cosmetic `WHISPER` message containing that HTML.

This ensures that the Game System (e.g., dnd5e) cannot interfere or try to "sanitize" the roll for other players, guaranteeing total privacy.

## 🚀 Installation

- **Manifest URL**: `https://github.com/GeanoFee/geanos-scene-optimizer/releases/latest/download/module.json` within Foundry's "Install Module" window.

---
## License
This module is licensed under the [MIT License](LICENSE).

