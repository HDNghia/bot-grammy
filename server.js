require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { Bot } = require("grammy");

const app = express();
app.use(bodyParser.json());
app.get("/", async (req, res) => {
    res.send("Hello Tradingview Webhook");
});

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Handle the /demo command
bot.command("demo", async (ctx) => {
    // Inline keyboard with options
    const optionsKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Option 1", callback_data: "option_1" },
                    { text: "Option 2", callback_data: "option_2" },
                ],
                [
                    { text: "Option 3", callback_data: "option_3" },
                ],
            ],
        },
    };

    // Send a message with the inline keyboard
    await ctx.reply("Choose an option:", optionsKeyboard);
});

// Handle callback queries for options
bot.on("callback_query:data", async (ctx) => {
    const selectedOption = ctx.callbackQuery.data;

    if (selectedOption.startsWith("option_")) {
        // Generate a response message based on the selected option
        const responseMessage = `You selected: ${selectedOption.replace("option_", "Option ")}`;

        // Inline keyboard with "Back to Options" button
        const backKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Back to Options", callback_data: "back_to_options" },
                    ],
                ],
            },
        };

        // Edit the current message with the response and new keyboard
        await ctx.editMessageText(responseMessage, backKeyboard);
        await ctx.answerCallbackQuery(); // Acknowledge the callback query
    } else if (selectedOption === "back_to_options") {
        // Inline keyboard with original options
        const optionsKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Option 1", callback_data: "option_1" },
                        { text: "Option 2", callback_data: "option_2" },
                    ],
                    [
                        { text: "Option 3", callback_data: "option_3" },
                    ],
                ],
            },
        };

        // Edit the message back to the original options
        await ctx.editMessageText("Choose an option:", optionsKeyboard);
        await ctx.answerCallbackQuery(); // Acknowledge the callback query
    }
});

// Start the bot
bot.start();

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => console.log(`Middleware Tradingview running on port ${PORT}`));
