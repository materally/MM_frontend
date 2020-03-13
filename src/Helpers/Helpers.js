export function numberWithSpace(x) {
    let a = x.toLocaleString()
    let res = a.replace(".", ",");
    return res
}

export function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export function calcBrutto(netto_val){
    var sz = Number(1.27);
    var netto = Number(netto_val)
    var brutto = Number(netto*sz);
    return round(brutto, 0);
}