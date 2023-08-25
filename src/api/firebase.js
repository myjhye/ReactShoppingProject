import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, set, get, remove, equalTo, query, orderByChild, update } from 'firebase/database';
import { v4 as uuid } from 'uuid';
import { AuthContextProvider } from "../context/AuthContext";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// 로그인
export function login() {

    // google 팝업으로 로그인 시작
    return signInWithPopup(auth, provider)
        // 오류 발생 시 오류 콘솔 출력
        .catch(console.error);
}


// 로그아웃
export async function logout() {

    return signOut(auth)
        .catch(console.error);
}


export function onUserStateChange(callback) {

    onAuthStateChanged(auth, async(user) => {
        const updatedUser = user ? await adminUser(user) : null;
        callback(updatedUser);
    });
}


// 주어진 사용자가 admin인지 확인하고 console에 출력하는 함수
function adminUser(user) {

    // firebase의 realtime database에서 'admins' 경로에 저장된 관리자 정보를 조회
    return get(ref(database, 'admins'))
        .then((snapshot) => {
            // 만약 관리자 정보가 존재하면
            if(snapshot.exists()) {
                // 관리자 정보를 객체로 변환하여 출력
                const admins = snapshot.val(); // .val() : 값 가져오기
                // 사용자의 고유 식별자(uid)가 관리자 목록(admins)에 포함 되어 있는지 확인
                const isAdmin = admins.includes(user.uid); // true/false로 반환

                //console.log('user : ', user);

                // 사용자 정보 업데이트 해서 관리자 여부(isAdmin) 추가
                return {
                    ...user, // 기존 사용자 정보
                    isAdmin // isAdmin 필드 추가
                }
            }
            return user;
        })
}


// 새 제품 등록
export async function addNewProduct(product, imageUrl, userId) {

    const id = uuid();
    const currentDate = new Date();

    set(ref(database, `products/${ id }`), {
        ...product,
        id: id,
        uid: userId,
        price: parseInt(product.price),
        image: imageUrl,
        options: product.options.split(','),
        date: currentDate.toISOString(),
    })
}


// 등록한 제품 정보 수정
export async function updateProduct(productId, updatedProduct) {

    const productRef = ref(database, `products/${ productId }`);
    const currentDate = new Date();

    await update(productRef, {
        ...updatedProduct,
        price: parseInt(updatedProduct.price),
        options: String(updatedProduct.options).split(','),
        date: currentDate.toISOString(),
    });
}



// 모든 제품 읽어오기
export async function getProducts() {

    return get(ref(database, `products`))
        .then((snapshot) => {
            const items = snapshot.val() || {};
            return Object.values(items);
        })
}


// 내가 등록한 제품 읽어오기
export async function getMyProducts(userId) {
    const productsRef = ref(database, `products`);
    const userProductsQuery = query(productsRef, orderByChild('uid'), equalTo(userId));

    const snapshot = await get(userProductsQuery);
    const items = snapshot.val() || {};

    // Convert the object to an array of values
    const productList = Object.values(items);

    return productList;
}

export async function removeMyProducts(productId) {

    return remove(ref(database, `products/${productId}`));
}



// cart에 product 데이터 추가
export async function addOrUpdateToCart(userId, product) {

    return set(ref(database, `carts/${ userId }/${ product.id }`), product);
}


// cart 데이터 읽어오기
export async function getCart(userId) {

    return get(ref(database, `carts/${ userId }`))
        .then((snapshot) => {
            const items = snapshot.val() || {};
            return Object.values(items);
        })
}

// cart 데이터 삭제
export async function removeFromCart( userId, productId ) {

    return remove(ref(database, `carts/${ userId }/${ productId }`));
}



export async function searchProductByName(name) {
    try {
        const productsRef = ref(database, 'products');
        const queryRef = query(
            productsRef,
            orderByChild('title')
        );

        const querySnapshot = await get(queryRef);

        const results = [];

        querySnapshot.forEach((doc) => {
            const productTitle = doc.child('title').val();
            if (productTitle.includes(name)) {
                results.push(doc.val());
            }
        });

        return results;
    } catch (error) {
        console.error('Error searching products by name:', error);
        return [];
    }
}