export default function(){
  // Add your transitions here, like:
    // this.transition(
    //   this.fromRoute('people.index'),
    //   this.toRoute('people.detail'),
    //   this.use('toLeft'),
    //   this.reverse('toRight')
    // );

    this.transition(
      this.hasClass('animate'),
      this.toValue(true),
      this.use('toDown'),
      this.reverse('toUp')
    );
}
