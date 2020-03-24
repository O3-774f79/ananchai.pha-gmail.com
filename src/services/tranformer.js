import axios from 'axios'
// InquiryTranformer(TranformerID?) {
//     // let url = `https://mg.sandais.com/apiRoute/tranformers/InquiryTranformer`
//     let url = `http://52.163.210.101:44000/apiRoute/tranformers/InquiryTranformer`
//     TranformerID ? url = `http://52.163.210.101:44000/apiRoute/tranformers/InquiryTranformer?TranformerID=${TranformerID}` : null
//     return this.http.get<any>(url)
//       .pipe(map(response => {
//         return response
//       }));
//   }

export const InquiryTranformer = () => {
    axios.get("http://52.163.210.101:44000/apiRoute/tranformers/InquiryTranformer")
        .then(res => {
            return res.data
        })
        .catch(err => {
            return err
        })
}