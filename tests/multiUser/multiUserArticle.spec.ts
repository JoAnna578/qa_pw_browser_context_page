import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';

let viewArticlePageUser2: ViewArticlePage;

test.beforeEach(async ({ page1, page2, user1, user2, articleWithoutTags }) => {
  // Rejestracja dwóch użytkowników
  await signUpUser(page1, user1); // User1
  await signUpUser(page2, user2); // User2

  // User1 tworzy artykuł
  await createArticle(page1, articleWithoutTags);

  // Przygotowanie strony dla User2
  viewArticlePageUser2 = new ViewArticlePage(page2);
});

test('Multi-user article interaction', async ({ articleWithoutTags }) => {
  // User2 otwiera artykuł stworzony przez User1
  await viewArticlePageUser2.open(articleWithoutTags.url);
  await viewArticlePageUser2.assertArticleTitleIsVisible(
    articleWithoutTags.title,
  );
  await viewArticlePageUser2.assertArticleTextIsVisible(
    articleWithoutTags.text,
  );

  // User2 follow autora
  await viewArticlePageUser2.followAuthor();

  // Sprawdzenie, że artykuł pojawia się w Your Feed
  await viewArticlePageUser2.goToYourFeed();
  await viewArticlePageUser2.assertArticleTitleIsVisible(
    articleWithoutTags.title,
  );

  // User1 aktualizuje artykuł
  await createArticle(page1, { ...articleWithoutTags, title: 'Updated Title' });

  // User2 widzi zaktualizowany artykuł
  await viewArticlePageUser2.open(articleWithoutTags.url);
  await viewArticlePageUser2.assertArticleTitleIsVisible('Updated Title');

  // User2 unfollow autora
  await viewArticlePageUser2.unfollowAuthor();

  // Artykuł nie powinien być widoczny w Your Feed po unfollow
  await viewArticlePageUser2.goToYourFeed();
  await viewArticlePageUser2.assertArticleIsNotVisible('Updated Title');
});
