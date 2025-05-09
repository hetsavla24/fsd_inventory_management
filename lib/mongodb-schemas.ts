// MongoDB schema validation for collections

export const productSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "name", "category", "purchaseDate", "expiryDate", "quantity"],
      properties: {
        id: {
          bsonType: "string",
          description: "Product ID - required and must be a string",
        },
        name: {
          bsonType: "string",
          description: "Product name - required and must be a string",
        },
        category: {
          bsonType: "string",
          description: "Product category - required and must be a string",
        },
        purchaseDate: {
          bsonType: "string",
          description: "Purchase date in ISO format - required and must be a string",
        },
        expiryDate: {
          bsonType: "string",
          description: "Expiry date in ISO format - required and must be a string",
        },
        quantity: {
          bsonType: ["int", "double"],
          description: "Product quantity - required and must be a number",
        },
        supplier: {
          bsonType: "string",
          description: "Supplier name - must be a string",
        },
        price: {
          bsonType: ["double", "int"],
          description: "Price per unit - must be a number",
        },
        storageLocation: {
          bsonType: "string",
          description: "Storage location - must be a string",
        },
        notes: {
          bsonType: "string",
          description: "Additional notes - must be a string",
        },
        createdAt: {
          bsonType: "string",
          description: "Creation timestamp - must be a string",
        },
        updatedAt: {
          bsonType: "string",
          description: "Last update timestamp - must be a string",
        },
      },
    },
  },
}

export const supplierSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "name", "contactPerson", "email", "phone"],
      properties: {
        id: {
          bsonType: "string",
          description: "Supplier ID - required and must be a string",
        },
        name: {
          bsonType: "string",
          description: "Supplier name - required and must be a string",
        },
        contactPerson: {
          bsonType: "string",
          description: "Contact person name - required and must be a string",
        },
        email: {
          bsonType: "string",
          description: "Email address - required and must be a string",
        },
        phone: {
          bsonType: "string",
          description: "Phone number - required and must be a string",
        },
        address: {
          bsonType: "string",
          description: "Physical address - must be a string",
        },
        notes: {
          bsonType: "string",
          description: "Additional notes - must be a string",
        },
        createdAt: {
          bsonType: "string",
          description: "Creation timestamp - must be a string",
        },
        updatedAt: {
          bsonType: "string",
          description: "Last update timestamp - must be a string",
        },
      },
    },
  },
}

export const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "passwordHash"],
      properties: {
        email: {
          bsonType: "string",
          description: "User email - required and must be a string",
        },
        name: {
          bsonType: "string",
          description: "User name - required and must be a string",
        },
        passwordHash: {
          bsonType: "string",
          description: "Hashed password - required and must be a string",
        },
        role: {
          bsonType: "string",
          enum: ["admin", "manager", "staff"],
          description: "User role - must be one of the enum values",
        },
        createdAt: {
          bsonType: "string",
          description: "Creation timestamp - must be a string",
        },
        updatedAt: {
          bsonType: "string",
          description: "Last update timestamp - must be a string",
        },
      },
    },
  },
}
