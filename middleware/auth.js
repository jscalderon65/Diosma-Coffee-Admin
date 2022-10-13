export default function ({ store, redirect, $fire }) {
  const getValidUsers = async () => {
    try {
      let validEmails = [];
      const response = await $fire.firestore
        .collection("Users")
        .doc("Emails")
        .get();
      validEmails = response.data().data;
      return validEmails;
    } catch (error) {
      console.log(error);
    }
  };
  getValidUsers().then(async (emails) => {
    if (!store.state.user) {
      redirect("/login");
    } else {
      if (!emails.some((e) => e.email === store.state.user.email)) {
        redirect("/login");
        await $fire.auth.signOut();
      }
    }
  });
}
