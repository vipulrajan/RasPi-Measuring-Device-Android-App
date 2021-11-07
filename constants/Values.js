export default
    {
        units: { cm: "cm", in: "in", ft: "ft", m: "m" },
        unitDivisors: { cm: 629.9212598425197, in: 1600, m: 62992.1259843, ft: 19200.00768 },
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