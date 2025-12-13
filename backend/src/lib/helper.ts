export function capitalizeString(value: string) {
	if (!value || typeof value !== "string") {
		return null;
	}
	const string = value;
	const capitalizedString = string
		.split("_")
		.map((i) => i.charAt(0).toUpperCase() + i.slice(1))
		.join(" ");
	return capitalizedString;
}
