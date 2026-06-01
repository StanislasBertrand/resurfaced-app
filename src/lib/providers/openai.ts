export async function fetchOpenAICosts(
  adminApiKey: string,
  startTime: Date,
  endTime: Date,
): Promise<number> {
  const startUnix = Math.floor(startTime.getTime() / 1000);
  const endUnix = Math.floor(endTime.getTime() / 1000);

  const url = new URL("https://api.openai.com/v1/organization/costs");
  url.searchParams.set("start_time", startUnix.toString());
  url.searchParams.set("end_time", endUnix.toString());
  url.searchParams.set("bucket_width", "1d");
  url.searchParams.set("limit", "31");

  let totalCost = 0;
  let nextPage: string | undefined;

  do {
    if (nextPage) url.searchParams.set("page", nextPage);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${adminApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return totalCost;

    const data = await res.json();
    console.log("OpenAI cost response:", JSON.stringify(data).slice(0, 500));

    for (const bucket of data.data ?? []) {
      for (const result of bucket.results ?? []) {
        totalCost += parseFloat(result.amount?.value ?? "0");
      }
    }

    nextPage = data.has_more ? data.next_page : undefined;
  } while (nextPage);

  return totalCost;
}
