const LOG_PREFIX = "[283 PinP] "
	.split("")
	.map((char) => `%c${char}`)
	.join("");
const LOG_PREFIX_STYLES = [
	"#FFAF77",
	"#FB9CA7",
	"#F682E9",
	"#EF7BFF",
	"#D97FFF",
	"#B985FF",
	"#968CFF",
	"#84A0FF",
	"#76B0FF",
	"#6ABDFF",
].map((color) => `font-weight: bold; color: ${color}`);

export const log = (message: string) => {
	console.info(`${LOG_PREFIX}${message}`, ...LOG_PREFIX_STYLES, "");
};
