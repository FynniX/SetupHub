const {EntitySchema} = require("typeorm");

module.exports = new EntitySchema({
    name: "user",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        email: {
            type: "varchar",
        },
        password: {
            type: "varchar"
        },
        token: {
            type: "varchar"
        },
        isAdmin: {
            type: "boolean"
        }
    }
});