import castArray from "lodash/castArray";

export const Console = {
    Other: {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m"
    },

    Foreground: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
        Gray: "\x1b[90m"
    },

    Background: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m",
        Gray: "\x1b[100m"
    },

    Color: (text: string | number, colors: string | string[]) => `${castArray(colors).map(color => color).join("")}${text}${Console.Other.Reset}`,

    Yellow: (text: string | number) => Console.Color(text, Console.Foreground.Yellow),
    Green: (text: string | number) => Console.Color(text, Console.Foreground.Green),
    Red: (text: string | number) => Console.Color(text, Console.Foreground.Red),
    Cyan: (text: string | number) => Console.Color(text, Console.Foreground.Cyan),

    Bright: (text: string | number) => Console.Color(text, Console.Other.Dim),
    Dim: (text: string | number) => Console.Color(text, Console.Other.Dim),

    BrightYellowOnBlue: (text: string | number) => Console.Color(text, [Console.Foreground.Yellow, Console.Background.Blue, Console.Other.Bright]),

    Ratio: (numerator: number, denominator: number, colors: string | string[]) => `${Console.Color(numerator.toFixed(0), colors)}/${Console.Color(denominator.toFixed(0), colors)}`,
    Percentage: (percentage: number, colors: string | string[]) => Console.Color(`${percentage.toFixed(1)}%`, colors),
};
