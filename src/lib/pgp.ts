import Pgp, {IMain} from 'pg-promise';

const pgpOpts: any = {
  capSQL: true
};

if (process.env.DEBUG) {
  pgpOpts.query = (q: any) => console.log(q.query); // eslint-disable-line no-console
}

const pgp: IMain = Pgp(pgpOpts);
export default pgp;
