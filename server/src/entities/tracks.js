const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "tracks",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
        },
        folder: {
            type: "varchar"
        },
        game: {
            type: "varchar"
        }
    }
});