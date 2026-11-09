import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("MARK card", () => {
  test("renders the profile content", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Muhammad Arslan" }),
    ).toBeVisible();
    await expect(page.getByText("Architect and Energy Consultant")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bio" })).toBeVisible();
  });

  test("platform links point to the right destinations", async ({ page }) => {
    await page.goto("/");
    const href = (name: string) =>
      page.getByRole("link", { name }).getAttribute("href");
    expect(await href("WhatsApp")).toBe("https://wa.me/923449240884");
    expect(await href("Instagram")).toContain("instagram.com/mark_architects_pvt");
    expect(await href("Facebook")).toContain("facebook.com/architectmak");
    expect(await href("Call")).toBe("tel:+923130003322");
  });

  test("external links are safe", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[target="_blank"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(external.nth(i)).toHaveAttribute("rel", /noopener/);
    }
  });

  test("Save Contact downloads a valid vCard", async ({ page }) => {
    await page.goto("/");
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Save Contact" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("Muhammad-Arslan.vcf");
    const stream = await download.createReadStream();
    let text = "";
    for await (const chunk of stream) text += chunk.toString();
    expect(text).toContain("BEGIN:VCARD");
    expect(text).toContain("FN:Muhammad Arslan");
    await expect(page.getByRole("status")).toHaveText("Contact file downloaded");
  });

  test("Share falls back to copying the link", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { value: undefined });
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Share Google direction" }).click();
    await expect(page.getByRole("status")).toHaveText("Link copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "https://g.co/kgs/iRfq8Tg",
    );
  });

  test("platform tiles are keyboard reachable", async ({ page }) => {
    await page.goto("/");
    const tile = page.getByRole("link", { name: "Instagram" });
    await tile.focus();
    await expect(tile).toBeFocused();
  });

  test("has no horizontal scroll at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBe(0);
  });

  for (const width of [768, 1024, 1440, 1920]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBe(0);
    });
  }

  test("desktop uses two columns: profile card left, content right", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const header = await page.locator("header").boundingBox();
    const bio = await page.locator("#bio-title").boundingBox();
    expect(header).not.toBeNull();
    expect(bio).not.toBeNull();
    // Bio sits to the right of the profile card, not below it.
    expect(bio!.x).toBeGreaterThan(header!.x + header!.width);
    // Four platform tiles share one row.
    const tops = await page
      .locator("section[aria-labelledby=platforms-title] a")
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
  });

  for (const width of [1024, 1280, 1920]) {
    test(`platform labels are not truncated at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const truncated = await page
        .locator("section[aria-labelledby=platforms-title] a span.truncate")
        .evaluateAll((els) =>
          els.filter((el) => el.scrollWidth > el.clientWidth).map((el) => el.textContent),
        );
      expect(truncated).toEqual([]);
    });
  }

  test("icon animations start after load and run while visible", async ({
    page,
  }) => {
    await page.goto("/");
    const animated = () =>
      page.evaluate(() =>
        [...document.querySelectorAll("svg")]
          .filter((s) => s.querySelector("animateTransform"))
          .map((s) => s.animationsPaused()),
      );
    expect(await animated()).toHaveLength(6);
    // Everything is on screen at the default phone viewport, so all six start.
    await expect.poll(async () => (await animated()).every((p) => !p)).toBe(true);
  });

  test("all icons fill and drain in sync", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
    // Sample the timelines several times across a full 6s loop.
    for (let i = 0; i < 4; i++) {
      const times = await page.evaluate(() =>
        [...document.querySelectorAll("svg")]
          .filter((s) => s.querySelector("animateTransform"))
          .map((s) => s.getCurrentTime()),
      );
      expect(times).toHaveLength(6);
      expect(Math.max(...times) - Math.min(...times)).toBeLessThan(0.3);
      await page.waitForTimeout(1500);
    }
  });

  test("icons stay in sync after being scrolled out of view and back", async ({
    page,
  }) => {
    // Tall enough that the Bio and Google direction icons share the first screen.
    await page.setViewportSize({ width: 390, height: 520 });
    await page.goto("/");
    await page.waitForTimeout(2200);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const times = await page.evaluate(() =>
      [...document.querySelectorAll("svg")]
        .filter((s) => s.querySelector("animateTransform") && !s.animationsPaused())
        .map((s) => s.getCurrentTime()),
    );
    expect(times.length).toBeGreaterThan(1);
    expect(Math.max(...times) - Math.min(...times)).toBeLessThan(0.3);
  });

  test("icon animations pause while scrolled out of view", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 300 });
    await page.goto("/");
    await page.waitForTimeout(2200);
    const states = await page.evaluate(() =>
      [...document.querySelectorAll("svg")]
        .filter((s) => s.querySelector("animateTransform"))
        .map((s) => ({
          paused: s.animationsPaused(),
          onScreen: s.getBoundingClientRect().top < window.innerHeight,
        })),
    );
    // Off-screen icons are paused; visible ones run.
    expect(states.some((s) => !s.onScreen)).toBe(true);
    for (const s of states) expect(s.paused).toBe(!s.onScreen);
  });

  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("icon animations are paused", async ({ page }) => {
      await page.goto("/");
      // Effects run after hydration; wait until the icons report paused.
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.querySelectorAll("svg")]
              .filter((s) => s.querySelector("animateTransform"))
              .every((s) => s.animationsPaused()),
          ),
        )
        .toBe(true);
    });
  });

  test("phone keeps a single column", async ({ page }) => {
    await page.goto("/");
    const header = await page.locator("header").boundingBox();
    const bio = await page.locator("#bio-title").boundingBox();
    expect(bio!.y).toBeGreaterThan(header!.y + header!.height);
  });

  test("has no automatically detectable accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("sends security headers", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["referrer-policy"]).toBeTruthy();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  });
});
