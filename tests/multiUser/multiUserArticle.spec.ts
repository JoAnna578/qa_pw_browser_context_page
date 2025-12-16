import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { HomePage } from '../../../src/ui/pages/HomePage';

let viewArticlePageUser2: ViewArticlePage;
let homePageUser2: HomePage;

test.beforeEach(async ({ page1, page2, user1, user2, articleWithoutTags }) => {
  await signUpUser(page1, user1);
  await signUpUser(page2, user2);

  await createArticle(page1, articleWithoutTags);

  homePageUser2 = new HomePage(page2);
  viewArticlePageUser2 = new ViewArticlePage(page2);
});

// Poprawiony test z minimalnymi zmianami
test('Multi-user article interaction', async ({
  page1,
  page2,
  articleWithoutTags,
}) => {
  // User2 widzi artykuł w Global Feed zamiast otwierania przez URL
  await homePageUser2.open();
  await homePageUser2.clickGlobalFeedTab();
  await homePageUser2.assertArticleTitleIsVisible(articleWithoutTags.title);
  await homePageUser2.clickArticleTitle(articleWithoutTags.title);

  // Follow/Unfollow i weryfikacja
  await viewArticlePageUser2.clickFollowButton();
  await viewArticlePageUser2.assertFollowButtonShows('Unfollow');

  await viewArticlePageUser2.clickFollowButton();
  await viewArticlePageUser2.assertFollowButtonShows('Follow');

  // User1 aktualizuje artykuł
  const updatedTitle = 'Updated Title';
  await createArticle(page1, { ...articleWithoutTags, title: updatedTitle });

  // User2 widzi zaktualizowany artykuł
  await homePageUser2.open();
  await homePageUser2.clickGlobalFeedTab();
  await homePageUser2.assertArticleTitleIsVisible(updatedTitle);

  // Your Feed po follow/unfollow
  await viewArticlePageUser2.clickFollowButton(); // follow
  await homePageUser2.open();
  await homePageUser2.clickYourFeedTab();
  await homePageUser2.assertArticleTitleIsVisible(updatedTitle);

  await viewArticlePageUser2.clickFollowButton(); // unfollow
  await homePageUser2.open();
  await homePageUser2.clickYourFeedTab();
  await homePageUser2.assertArticleTitleIsNotVisible(updatedTitle); // nowa metoda w HomePage
});
