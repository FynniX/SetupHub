const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "cars",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
        },
        shorthand: {
            type: "varchar",
        },
        folder: {
            type: "varchar"
        },
        game: {
            type: "varchar"
        },
        class: {
            type: "varchar"
        }
    }
});