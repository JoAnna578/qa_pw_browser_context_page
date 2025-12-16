import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../src/ui/actions/articles/createArticle';
import { SignInPage } from '../../src/ui/pages/auth/SignInPage';
import { HomePage } from '../../src/ui/pages/HomePage';

let signInPage;
let homePageLoggedIn;
let homePageLoggedOut;

test.beforeEach(async ({ page1, page2, user, articleWithoutTags }) => {
  // Create user
  await signUpUser(page1, user);

  // Logged-in context
  signInPage = new SignInPage(page1);
  homePageLoggedIn = new HomePage(page1);

  // Logged-out context
  homePageLoggedOut = new HomePage(page2);

  // Create article as logged-in user
  await createArticle(page1, articleWithoutTags);
});

test('User can sign in', async ({ user }) => {
  await signInPage.open();
  await signInPage.fillEmailField(user.email);
  await signInPage.fillPasswordField(user.password);
  await signInPage.clickSignInButton();

  await homePageLoggedIn.assertYourFeedTabIsVisible();
});

test('User sees own article in Global Feed when not logged in', async ({
  articleWithoutTags,
}) => {
  await homePageLoggedOut.open();
  await homePageLoggedOut.clickGlobalFeedTab();
  await homePageLoggedOut.assertArticleTitleIsVisible(articleWithoutTags.title);
});
