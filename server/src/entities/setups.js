const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "setups",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        filename: {
            type: "varchar",
        },
        game: {
            type: "varchar"
        },
        car: {
            type: "varchar"
        },
        track: {
            type: "varchar"
        },
        description: {
            type: "text"
        },
        downloads: {
            type: "int"
        },
        date: {
            type: "datetime"
        }
    }
});