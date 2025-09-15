type GSTAddress = {
    addr: {
        bno?: string;
        bldg?: string;
        flno?: string;
        st?: string;
        loc?: string;
        city?: string;
        dist?: string;
        state?: string;
        pncd?: string;
        locality?: string;
        bnm?: string;
        dst?: string;
        stcd?: string;
    };
    ntr: string;
}

type GSTData = {
    adadr: [];
    ctb: string;
    ctj: string;
    ctjCd: string;
    cxdt: string;
    dty: string;
    einvoiceStatus: string;
    gstin: string;
    lgnm: string;
    lstupdt: string;
    nba: string[];
    pradr: GSTAddress;
    rgdt: string;
    stj: string;
    stjCd: string;
    sts: string;
    tradeNam: string;
}
