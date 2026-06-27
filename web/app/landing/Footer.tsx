export default function Footer() {

  return (

    <footer className="border-t bg-white">



      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-16 md:grid-cols-3">



        {/* Brand */}

        <div>

          <h2 className="mb-4 text-2xl font-bold text-teal-700">

            MonTrip

          </h2>



          <p className="text-sm text-gray-500 leading-relaxed">

            AI-д суурилсан аяллын маршрут төлөвлөгч платформ.

            Таны төсөв, хугацаа, сонирхолд тохирсон аяллыг

            ухаалгаар төлөвлөж өгнө.

          </p>



          <p className="mt-6 text-xs text-gray-400">

            © 2026 MonTrip. Бүх эрх хуулиар хамгаалагдсан.

          </p>

        </div>



        {/* Product */}

        <div>

          <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">

            Бүтээгдэхүүн

          </h3>



          <ul className="space-y-3 text-sm text-gray-500">

            <li className="hover:text-teal-700 transition cursor-pointer">

              AI аяллын төлөвлөгч

            </li>

            <li className="hover:text-teal-700 transition cursor-pointer">

              Ухаалаг маршрут үүсгэгч

            </li>

            <li className="hover:text-teal-700 transition cursor-pointer">

              Зардлын тооцоолуур

            </li>

            <li className="hover:text-teal-700 transition cursor-pointer">

              Аяллын гарын авлага

            </li>

          </ul>

        </div>



        {/* Company */}

        <div>

          <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wide">

            Компани

          </h3>



          <ul className="space-y-3 text-sm text-gray-500">

            <li className="hover:text-teal-700 transition cursor-pointer">

              Бидний тухай

            </li>

            <li className="hover:text-teal-700 transition cursor-pointer">

              Үйлчилгээний нөхцөл

            </li>

            <li className="hover:text-teal-700 transition cursor-pointer">

              Нууцлалын бодлого

            </li>

            <li className="hover:text-teal-700 transition cursor-pointer">

              Холбоо барих

            </li>

          </ul>

        </div>



      </div>



      {/* bottom bar */}

      <div className="border-t">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6 text-xs text-gray-400">



          <p>

            Монголыг ухаалгаар аялуулахад зориулав 🇲🇳

          </p>



          <p className="hover:text-teal-700 transition cursor-pointer">

            montrip.ai

          </p>



        </div>

      </div>



    </footer>

  );

}