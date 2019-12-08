import android.os.AsyncTask;
import androidx.preference.ListPreference;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Vector;

// ...

void updateDnsList(){
    // start a thread and do the DNS request
    final AsyncTask<Void, Void, String[]> xxx = new AsyncTask<Void, Void, String[]>() {
        @Override
        protected String[] doInBackground(Void... params) {
            Vector<String> listResult = new Vector<String>();
            try {
                // add all round robin servers one by one to select them separately
                InetAddress[] list = InetAddress.getAllByName("all.api.radio-browser.info");
                for (InetAddress item : list) {
                    listResult.add(item.getCanonicalHostName());
                }
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
            return listResult.toArray(new String[0]);
        }

        @Override
        protected void onPostExecute(String[] result) {
            // do something with the result
            super.onPostExecute(result);
        }
    }.execute();
}

// ...