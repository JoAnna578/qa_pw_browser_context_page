import { test } from '../_fixtures/fixtures';
import { signUpUser } from '../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../src/ui/actions/articles/createArticle';
import { SignInPage } from '../../src/ui/pages/auth/SignInPage';
import { HomePage } from '../../src/ui/pages/HomePage';
import { SettingsPage } from '../../src/ui/pages/SettingsPage'; // dodane do zmiany hasła

let signInPage;
let homePageLoggedIn;
let homePageLoggedOut;

test.beforeEach(async ({ page1, page2, user, articleWithoutTags }) => {
  await signUpUser(page1, user);

  signInPage = new SignInPage(page1);
  homePageLoggedIn = new HomePage(page1);
  homePageLoggedOut = new HomePage(page2);

  await createArticle(page1, articleWithoutTags);
});

// Zmieniony test logowania po zmianie hasła
test('User can sign in with changed password', async ({ page1, user }) => {
  // krok zmiany hasła
  const settingsPage = new SettingsPage(page1);
  await settingsPage.open();
  const newPassword = 'newSecret123';
  await settingsPage.changePassword(user.password, newPassword);
  user.password = newPassword;

  // logowanie z nowym hasłem
  await signInPage.open();
  await signInPage.fillEmailField(user.email);
  await signInPage.fillPasswordField(user.password);
  await signInPage.clickSignInButton();

  await homePageLoggedIn.assertYourFeedTabIsVisible();
});

// Test pozostaje praktycznie bez zmian
test('User sees own article in Global Feed when not logged in', async ({
  articleWithoutTags,
}) => {
  await homePageLoggedOut.open();
  await homePageLoggedOut.clickGlobalFeedTab();
  await homePageLoggedOut.assertArticleTitleIsVisible(articleWithoutTags.title);
});
