const KOMMO_DOMAIN = process.env.KOMMO_ACCOUNT_DOMAIN;
const KOMMO_TOKEN = process.env.KOMMO_ACCESS_TOKEN;

async function kommoFetch(endpoint: string, options: RequestInit = {}) {
  if (!KOMMO_DOMAIN || !KOMMO_TOKEN) {
    console.warn("Kommo not configured, skipping API call");
    return null;
  }

  const url = `https://${KOMMO_DOMAIN}.kommo.com/api/v4${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${KOMMO_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    console.error(`Kommo API error: ${res.status}`, await res.text());
    return null;
  }

  return res.json();
}

export async function createKommoContact(data: {
  name: string;
  email: string;
  phone?: string;
}) {
  return kommoFetch("/contacts", {
    method: "POST",
    body: JSON.stringify([
      {
        name: data.name || data.email,
        custom_fields_values: [
          {
            field_code: "EMAIL",
            values: [{ value: data.email, enum_code: "WORK" }],
          },
          ...(data.phone
            ? [
                {
                  field_code: "PHONE",
                  values: [{ value: data.phone, enum_code: "WORK" }],
                },
              ]
            : []),
        ],
      },
    ]),
  });
}

export async function createKommoLead(data: {
  name: string;
  price: number;
  contactId?: number;
  orderId: string;
}) {
  const leadData: Record<string, unknown> = {
    name: data.name,
    price: data.price,
    custom_fields_values: [
      {
        field_name: "Order ID",
        values: [{ value: data.orderId }],
      },
    ],
  };

  if (data.contactId) {
    leadData._embedded = {
      contacts: [{ id: data.contactId }],
    };
  }

  return kommoFetch("/leads", {
    method: "POST",
    body: JSON.stringify([leadData]),
  });
}

export async function updateKommoLead(
  leadId: number,
  data: { statusId?: number; price?: number }
) {
  return kommoFetch(`/leads/${leadId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
