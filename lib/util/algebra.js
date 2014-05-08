module.exports = {

	getWith: function getWidth(attr) {
		return function (object) { return object[attr]; };
	},

	mapWith: function mapWidth(fn) {
		return function (list) {
			return Array.prototype.map.call(list, fn);
		};
	}
};
