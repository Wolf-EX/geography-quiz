export function mod(n, d){
    return ((n % d) + d) % d;
    //return -(Math.floor(n / d) * d - n);
}