export function GCD(a, b){
    if(b===0) return a;
    return GCD(b, a%b);
}

export function factorial(n){
    if(n===0) return 1;
    return n * factorial(n-1);
}
