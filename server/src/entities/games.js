const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "games",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        shorthand: {
            type: "varchar"
        }
    }
});