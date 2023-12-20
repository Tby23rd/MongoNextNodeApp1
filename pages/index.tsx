import { GetServerSideProps } from 'next';
import styles from '../styles/getData.module.css'; // Import the CSS module

interface CustomerData {
  _id: { $oid: string };
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface HomeProps {
  data: CustomerData[];
}

const Home: React.FC<HomeProps> = ({ data }) => {
  return (
    <div>
      <h1>Home Page</h1>
      <table className={styles['table-container']}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer) => (
            <tr key={customer._id.$oid}>
              <td>{customer.first_name} {customer.last_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const apiUrl = 'http://localhost:3000/api/data'; // Updated the API endpoint

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data: CustomerData[] = await response.json();

    return {
      props: { data },
    };
  } catch (error: unknown) {
    console.error('Error fetching data:', (error as Error).message);
    return {
      props: { data: [] },
    };
  }
};

export default Home;
