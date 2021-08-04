import classes from './starting-page.module.css';

function StartingPageContent() {
  // Show Link to Login page if NOT auth

  return (
    <section className={classes.starting}>
      <h2>Welcome on Board!</h2>
    </section>
  );
}

export default StartingPageContent;
