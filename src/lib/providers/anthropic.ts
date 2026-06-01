export async function fetchAnthropicCosts(
  adminApiKey: string,
  startTime: Date,
  endTime: Date,
): Promise<number> {
  const url = new URL(
    "https://api.anthropic.com/v1/organizations/cost_report",
  );
  url.searchParams.set("starting_at", startTime.toISOString());
  url.searchParams.set("ending_at", endTime.toISOString());
  url.searchParams.set("bucket_width", "1d");
  url.searchParams.set("limit", "31");

  let totalCost = 0;
  let nextPage: string | undefined;

  do {
    if (nextPage) url.searchParams.set("page", nextPage);

    const res = await fetch(url.toString(), {
      headers: {
        "x-api-key": adminApiKey,
        "anthropic-version": "2023-06-01",
      },
    });

    if (!res.ok) return totalCost;

    const data = await res.json();
    for (const bucket of data.data ?? []) {
      for (const result of bucket.results ?? []) {
        totalCost += parseFloat(result.cost_cents ?? "0") / 100;
      }
    }

    nextPage = data.has_more ? data.next_page : undefined;
  } while (nextPage);

  return totalCost;
}
