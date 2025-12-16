import { expect, test, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly yourFeedTab;
  readonly globalFeedTab;
  readonly newArticleLink;
  readonly articleTitle;

  constructor(page: Page) {
    this.page = page;
    this.yourFeedTab = page.getByText('Your Feed');
    this.globalFeedTab = page.getByText('Global Feed');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.articleTitle = (title: string) => page.getByRole('heading', { name: title });
  }

  async open() {
    await test.step('Open Home page', async () => {
      await this.page.goto('/');
    });
  }

  async clickNewArticleLink() {
    await test.step(`Click the 'New Article' link`, async () => {
      await this.newArticleLink.click();
    });
  }

  async clickGlobalFeedTab() {
    await test.step(`Click the 'Global Feed' tab`, async () => {
      await this.globalFeedTab.click();
    });
  }

  async clickYourFeedTab() {
    await test.step(`Click the 'Your Feed' tab`, async () => {
      await this.yourFeedTab.click();
    });
  }

  async clickArticleTitle(title: string) {
    await test.step(`Click article title "${title}"`, async () => {
      await this.articleTitle(title).click();
    });
  }

  async assertYourFeedTabIsVisible() {
    await test.step(`Assert the 'Your Feed' tab is visible`, async () => {
      await expect(this.yourFeedTab).toBeVisible();
    });
  }

  async assertArticleTitleIsVisible(title: string) {
    await test.step(`Assert article title "${title}" is visible`, async () => {
      await expect(this.articleTitle(title)).toBeVisible();
    });
  }

  async assertArticleTitleIsNotVisible(title: string) {
    await test.step(`Assert article title "${title}" is NOT visible`, async () => {
      await expect(this.articleTitle(title)).not.toBeVisible();
    });
  }
}


