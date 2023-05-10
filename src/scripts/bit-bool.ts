class BitBool {

  private bits = new Uint8Array(1);
  constructor(initialValue: boolean = false){
    this.bits[0] = initialValue ? 1 : 0;
  }

  get(index: number){
    const mask = 1 << index;
    return (this.bits[0] & mask) >> index;
  }

  set(index: number, value: boolean){
    const mask = 1 << index;
    if(value)
      this.bits[0] |= mask;
    else
      this.bits[0] &= ~mask;
  }

  *[Symbol.iterator](){
    for(let i = 0; i < 8; i++)
      yield this.get(i) === 1;
  }

};

export default BitBool;

[ 10, 20, 30, 40 ].forEach((element, index, array) => {
  array[index] = element ** 2;
});