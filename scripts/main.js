Hooks.once('init', () => {
    CONFIG.Dice.rollModes.secret = {
        label: "Secret Roll",
        icon: "fa-solid fa-question"
    };

    // Inject CSS programmatically to ensure it applies and bypasses cache
    const styleId = "geanos-secret-rolls-styles";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            /* Force Secret Roll button to be upright and marked */
            button[data-roll-mode="secret"] {
                transform: none !important;
                rotate: 0deg !important;
                writing-mode: horizontal-tb !important;
            }
            /* Also ensure the icon inside (if pseudo-element or child) is not rotated */
            button[data-roll-mode="secret"] i,
            button[data-roll-mode="secret"]::before {
                transform: none !important;
                rotate: 0deg !important;
            }
        `;
        document.head.appendChild(style);
        console.log("Geano's Secret Rolls | Injected V13 Helper CSS");
    }
});

Hooks.on('preCreateChatMessage', (messageDoc, initialData, context, userId) => {
    if (userId !== game.user.id) return;
    if (messageDoc.getFlag("geanos-secret-rolls", "processed")) return;

    let rollMode = messageDoc.getFlag("core", "rollMode");
    if (!rollMode && initialData.flags?.core?.rollMode) {
        rollMode = initialData.flags.core.rollMode;
    }
    if (!rollMode) {
        rollMode = game.settings.get("core", "rollMode");
    }

    if (rollMode === 'secret') {
        // Abort original synchronous hook immediately

        const gmUsers = game.users.filter(u => u.isGM).map(u => u.id);

        // Async Processing
        (async () => {
            try {
                let parts = [];

                // 1. Preserve Original Content (The Card, Banner, Images, Text)
                if (messageDoc.content) {
                    parts.push(messageDoc.content);
                }

                // 2. Render Rolls (The Dice Box)
                if (messageDoc.rolls.length > 0) {
                    for (const roll of messageDoc.rolls) {
                        // Render as Public to see full details
                        const html = await roll.render({ rollMode: "roll" });
                        parts.push(html);
                    }
                }

                // 3. Play Sound
                if (messageDoc.rolls.length > 0) {
                    foundry.audio.AudioHelper.play({ src: CONFIG.sounds.dice });
                }

                // 4. Create Ghost Message
                // We combine the parts.
                // We do NOT attach the 'rolls' object, keeping this as a "Text/HTML" message
                // so the System doesn't try to hide it.
                await ChatMessage.create({
                    user: userId,
                    speaker: messageDoc.speaker,
                    content: parts.join(""), // Join without breaks, blocks usually handle themselves.
                    whisper: gmUsers,
                    // in V12+, 'type' is deprecated and 'style' doesn't need to be WHISPER (which is also deprecated).
                    // The presence of 'whisper' recipients makes it a whisper.
                    sound: null,
                    flags: {
                        core: { rollMode: "roll" },
                        "geanos-secret-rolls": { processed: true }
                    }
                });

            } catch (err) {
                console.error("Geano's Secret Rolls | Error:", err);
            }
        })();

        return false;
    }
});


