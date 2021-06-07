const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "classes",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
        }
    }
});