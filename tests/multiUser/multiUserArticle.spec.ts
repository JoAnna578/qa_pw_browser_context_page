import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { HomePage } from '../../../src/ui/pages/HomePage';

let viewArticlePageUser1: ViewArticlePage;
let viewArticlePageUser2: ViewArticlePage;
let homePageUser2: HomePage;

test.beforeEach(async ({ page1, page2, user1, user2, articleWithoutTags }) => {
  await signUpUser(page1, user1);
  await signUpUser(page2, user2);

  await createArticle(page1, articleWithoutTags);

  viewArticlePageUser1 = new ViewArticlePage(page1);
  viewArticlePageUser2 = new ViewArticlePage(page2);
  homePageUser2 = new HomePage(page2);
});

test('Multi-user article interaction', async ({
  page1,
  articleWithoutTags,
}) => {
  // User2 widzi artykuł w Global Feed
  await homePageUser2.open();
  await homePageUser2.clickGlobalFeedTab();
  await homePageUser2.assertArticleTitleIsVisible(articleWithoutTags.title);
  await homePageUser2.clickArticleTitle(articleWithoutTags.title);

  // Follow/Unfollow na stronie artykułu
  await viewArticlePageUser2.clickFollowButton();
  await viewArticlePageUser2.assertFollowButtonShows('Unfollow');

  await viewArticlePageUser2.clickFollowButton();
  await viewArticlePageUser2.assertFollowButtonShows('Follow');

  // User1 edytuje artykuł zamiast tworzyć nowy
  const updatedTitle = 'Updated Title';
  await viewArticlePageUser1.open(articleWithoutTags.url);
  await viewArticlePageUser1.editArticle({ title: updatedTitle });

  // User2 widzi zaktualizowany artykuł w Global Feed
  await homePageUser2.open();
  await homePageUser2.clickGlobalFeedTab();
  await homePageUser2.assertArticleTitleIsVisible(updatedTitle);

  // Your Feed po follow/unfollow
  await homePageUser2.clickGlobalFeedTab();
  await homePageUser2.clickArticleTitle(updatedTitle);
  await viewArticlePageUser2.clickFollowButton(); // follow

  await homePageUser2.open();
  await homePageUser2.clickYourFeedTab();
  await homePageUser2.assertArticleTitleIsVisible(updatedTitle);

  await homePageUser2.clickGlobalFeedTab();
  await homePageUser2.clickArticleTitle(updatedTitle);
  await viewArticlePageUser2.clickFollowButton(); // unfollow

  await homePageUser2.open();
  await homePageUser2.clickYourFeedTab();
  await homePageUser2.assertArticleTitleIsNotVisible(updatedTitle);
});
