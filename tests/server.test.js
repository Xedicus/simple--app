const request = require("supertest");
const { app } = require("../server"); // Assurez-vous que server.js exporte app

describe("API Endpoints", () => {
  let createdId;

  // Test pour ajouter une nouvelle entrée
  it("should create a new data entry", async () => {
    const response = await request(app)
      .post("/api/data")
      .send({ name: "Test Name" })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Name");

    createdId = response.body.id; // Sauvegarde l'ID pour le test de suppression
  });

  // Test pour récupérer toutes les entrées
  it("should retrieve all data entries", async () => {
    const response = await request(app)
      .get("/api/data")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test pour supprimer une entrée
  it("should delete the data entry", async () => {
    await request(app).delete(`/api/data/${createdId}`).expect(200);
  });
});
