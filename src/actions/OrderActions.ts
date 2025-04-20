export async function createRazorPayOrderId(amount: number) {
  try {
    const response = await fetch("http://localhost:3000/api/createRazorpayOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    console.log("RazorPay Order Created Successfully ----> ", data);
    return data.RazorPayOrderId;
  } catch (error) {
    console.error("ERROR while creting RP OID in the action file ----> ",error);
    throw new Error("Failed to create order");
  }
}