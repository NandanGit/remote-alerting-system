// Format Time into Human-readable format
exports.formatTime = (time) => {
	const date = new Date(time);
	// const year = date.getFullYear();
	// const month = date.getMonth() + 1;
	// const day = date.getDate();
	const hour = date.getHours();
	const min = date.getMinutes();
	const sec = date.getSeconds();
	const ms = date.getMilliseconds();
	// return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
	return `${hour}:${min}:${sec}`;
};
