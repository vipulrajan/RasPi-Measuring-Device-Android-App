export default
    {
        sex: { MALE: "Male", FEMALE: "Female" },
        status: {
            ACTIVE: "Active",
            CULLED: "Culled",
            SOLD: "Sold",
            DIED: "Died",
            LOST: "Lost",
            AUCTIONED: "Auctioned",
            TRANSFERRED: "Transferred",
            OTHER: "Other"
        },
        category: {
            lamb21: "Lamb (0-21)",
            lamb45: "Lamb (22-45)",
            lamb90: "Lamb (46-90)",
            weaner: "Weaner",
            hogget: "Hogget",
            adult: "Adult"
        },
        filterProperties: ["status", "sex", "category"]
    };