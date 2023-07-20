import { Link, useNavigate, useParams } from "react-router-dom";
import { Comment, Orange, Purple } from "../../helper/color";
import Spinner from "../Spinner";
import { useContext, useEffect, useState } from "react";
import { ContactContext } from "../../context/contactContext";
import {  getContact, updateContact } from "../../services/contactService";
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { contactSchema } from "../../validations/contactValidation";

const EditContact = ()=> {

    const navigate = useNavigate();
    const {contactId} = useParams();
    const { setLoading, setContacts, setFilteredContacts, loading, groups } = useContext(ContactContext);
    const [contact, setCotnact] = useState({});

    useEffect(()=> {
        const fetchData = async()=> {
          try {
            setLoading(true);
            const { data: contactData } = await getContact(contactId);
            setLoading(false);
            setCotnact(contactData);
          } catch(err) {
            console.log(err.message);
            setLoading(false);
          }
        }

        fetchData();
    }, []);


    const submitForm = async(values)=> {
      try {
        setLoading(true);
        const {status, data} = await updateContact(contactId, values);
        if(status === 200) {
          toast.info("مخاطب با موفقیت ویرایش شد.", {icon: "💋"});
          setLoading(false);
          setContacts((draft)=> {
            const indexNum = draft.findIndex(c => c.id === parseInt(contactId));
            draft[indexNum] = data;  
          });
          setFilteredContacts((draft) => { 
            const indexNum = draft.findIndex(c => c.id === parseInt(contactId));
            draft[indexNum] = data;
          });
          navigate('/contacts');
        }
      } catch(err) {
        console.log(err.message);
        setLoading(false);
      }
    }

    return (
        <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <div className="container">
              <div className="row my-2">
                <div className="col text-center">
                  <p className="h4 fw-bold" style={{ color: Orange }}>
                    ویرایش مخاطب
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: Orange }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ backgroundColor: "#44475a", borderRadius: "1em" }}
              >
                <div className="col-md-8">
                <Formik
                  initialValues={{
                    fullname: contact.fullname,
                    photo: contact.photo,
                    mobile: contact.mobile,
                    email: contact.email,
                    job: contact.job,
                    group: contact.group,
                    bio: contact.bio
                  }}
                  validationSchema={contactSchema}
                  onSubmit={values=> {
                    submitForm(values);
                  }}
                >
                  <Form>
                    <div className="mb-2">
                      <Field
                        name="fullname"
                        type="text"
                        className="form-control"
                        placeholder="نام و نام خانوادگی"
                      />
                      <ErrorMessage name="fullname">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>
                      
                    </div>
                    <div className="mb-2">
                      <Field
                        name="photo"
                        type="text"
                        className="form-control"
                        placeholder="آدرس تصویر"
                      />
                      <ErrorMessage name="photo">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>
                      
                      
                    </div>
                    <div className="mb-2">
                      <Field
                        name="mobile"
                        type="text"
                        className="form-control"
                        placeholder="شماره موبایل"
                      />
                      <ErrorMessage name="mobile">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>
                      
                    </div>
                    <div className="mb-2">
                      <Field
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="آدرس ایمیل"
                      />
                      <ErrorMessage name="email">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>
                      
                    </div>
                    <div className="mb-2">
                      <Field
                        name="job"
                        type="text"
                        className="form-control"
                        placeholder="شغل"
                      />
                      <ErrorMessage name="job">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>
                    
                    </div>
                    <div className="mb-2">
                      <Field
                        name="group"
                        as="select"
                        className="form-control"
                      >
                
                        <option value="">انتخاب گروه</option>
                        {
                            groups.length > 0 && groups.map((group)=> (  
                                <option key={group.id} value={group.id}>  
                                    {group.name}
                                </option>
                            ))
                        }
                      </Field>
                      <ErrorMessage name="group">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>
                    
                    </div>
                    
                    <div className="mb-2">
                      <Field
                        name="bio"
                        as="textarea"
                        className="form-control"
                        placeholder="بیوگرافی"
                      />
                      <ErrorMessage name="job">{msg=> <div className="text-danger">{msg}</div>}</ErrorMessage>     
                    </div>

                    <div className="mx-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: Purple }}
                        value="ویرایش مخاطب"
                      />
                      <Link
                        to={"/contacts"}
                        className="btn mx-2"
                        style={{ backgroundColor: Comment }}
                      >
                        انصراف
                      </Link>
                    </div>
                  </Form>
                </Formik>
                </div>
                <div className="col-md-4">
                  <img
                    src={contact.photo}
                    alt=""
                    className="img-fluid rounded"
                    style={{ border: `1px solid ${Purple}` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-1">
              <img
                src={require("../../assets/man-taking-note.png")}
                alt=""
                height="300px"
                style={{ opacity: "60%" }}
              />
            </div>
          </section>
        </>
      )}
    </>
    );
}

export default EditContact;