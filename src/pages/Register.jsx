import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { AuthForm } from "./Login";

function Register() {
  const { kayitOl } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState(null);

  async function gonder(e) {
    e.preventDefault();
    setHata(null);
    if (parola.length < 8) {
      setHata("Parola en az 8 karakter olmalı.");
      return;
    }
    setYukleniyor(true);
    try {
      await kayitOl(email.trim(), parola);
      navigate("/");
    } catch (err) {
      setHata(err.message);
    } finally {
      setYukleniyor(false);
    }
  }

  return <AuthForm
    baslik="Kayıt Ol"
    altMetin="Zaten hesabın var mı?"
    altLink={{ to: "/login", text: "Giriş yap" }}
    email={email} setEmail={setEmail}
    parola={parola} setParola={setParola}
    yukleniyor={yukleniyor} hata={hata}
    onSubmit={gonder} buton="Kayıt Ol"
  />;
}

export default Register;
