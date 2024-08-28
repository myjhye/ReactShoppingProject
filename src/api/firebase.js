import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, get, remove, equalTo, query, orderByChild, update, push, increment } from 'firebase/database';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});
const database = getDatabase(app);
 


// 로그인 -> google 로그인
export function login() {


    // google 팝업으로 로그인 시작

    // auth -> 인증 (로그인 시 항상 필요)
    // provider -> google
    return signInWithPopup(auth, provider)

        // 오류 발생 시 오류 콘솔 출력
        .catch(console.error);
}


// 로그아웃
export async function logout() {

    return signOut(auth)
        .catch(console.error);
}





// 사용자 로그인 상태 감지 -> 관리자 여부를 콜백함수에 전달
export function onUserStateChange(callback) {


    // 사용자의 로그인 상태 감지
    onAuthStateChanged(auth, async(user) => {


        // 사용자가 로그인 했으면 (user) -> 관리자 여부 확인 (adminUser)
        const updatedUser = user ? await adminUser(user) : null;


        // 콜백함수에 사용자 관리자 여부 전달
        callback(updatedUser);
    });
}








// 접속한 유저가 관리자인지 확인 -> 관리자 여부 추가하고 반환
function adminUser(user) {


    // admins 경로에 저장된 관리자 정보 조회
    return get(ref(database, 'admins'))
        
    
        .then((snapshot) => {
            // 관리자 정보 있으면
            if(snapshot.exists()) {
                
                // 관리자 정보를 객체로 변환해서 가져옴 -> .val() : 값 가져오기
                const admins = snapshot.val(); 
                


                // 접속한 유저의 고유 식별자(uid)가 관리자 목록(admins)에 포함되어 있는지 확인
                
                // true/false로 반환
                const isAdmin = admins.includes(user.uid); 



                // 사용자 정보 업데이트 -> 관리자 여부(isAdmin) 추가하고 반환
                return {
                    ...user, // 기존 사용자 정보
                    isAdmin // isAdmin 필드 추가
                }
            }
            return user;
        })
}






//--------------------- 제품


// 신규 제품 등록
export async function addNewProduct(id, product, imageUrl, userId) {

    // 현재 시간
    const currentDate = new Date();

    // 상품을 데이터베이스에 추가
    // ref: 경로 참조해서 가져오기
    // set: 해당 경로에 데이터 추가
    set(ref(database, `products/${ id }`), {

        // 기존 상품 가져오기(스프레드 연산자 사용: 기존 데이터에 신규 데이터 추가)
        ...product,

        // 추가하려는 정보 -> 고유 상품 아이디, 고유 사용자 아이디, 가격(문자열 -> 정수), 이미지 url, 등록 날짜 
        id: id,
        uid: userId,
        price: parseInt(product.price),
        image: imageUrl,
        date: currentDate.toISOString(),
    })
}





// 전체 제품 조회
export async function getProducts() {

    // ref -> products 경로 가져옴
    // get -> 경로 데이터 읽어옴

    return get(ref(database, `products`))
        
        .then((snapshot) => {
            // 스냅샷에서 데이터 추출 -> 없으면 빈 객체 사용
            const items = snapshot.val() || {};
            
            // 제품 정보를 배열로 변환해서 반환 -> 제품 목록 같은 다수 항목 표현
            return Object.values(items);
        })
}






// 제품 검색
export async function searchProductByName(name) {

    const results = [];

    try 
    {
        // 'products' 경로 데이터 가져오는 쿼리 실행
        const querySnapshot = await get(ref(database, 'products'));

        // 쿼리 결과를 반복하며 제품 검색 -> results 배열에 추가
        querySnapshot.forEach((doc) => { 

            // 제품 데이터의 이름(title) 추출 -> 소문자로 변환 
            const productTitle = doc.child('title').val().toLowerCase(); 
            
            // 검색어도 소문자로 변환 -> 제품 이름 데이터 중 검색어와 일치하는 제품 찾기 -> results 배열에 추가
            if (productTitle.includes(name.toLowerCase())) { 
                results.push(doc.val());
            }
        });

        // 검색 결과 반환
        return results;
    } 
    
    catch (error) 
    {
        console.error(error);
        
        // 오류 발생 시 빈 배열 반환
        return [];
    }
}






//--------------------- 장바구니


// cart에 product 데이터 추가
export async function addOrUpdateToCart(userId, product) {

    return set(ref(database, `carts/${ userId }/${ product.id }`), product);
}


// cart 데이터 읽어오기
export async function getCart(userId) {

    return get(ref(database, `carts/${ userId }`))
        .then((snapshot) => {

            // cart 값 추출 -> val -> 없으면 빈 객체({})로 초기화  
            const items = snapshot.val() || {};

            // cart 값(item)을 배열로 반환 -> Object.values() -> 값이 여러개라서
            return Object.values(items);
        })
}

// cart 데이터 삭제
export async function removeFromCart(userId, productId) {

    return remove(ref(database, `carts/${ userId }/${ productId }`));
}







//--------------------- 댓글

// 댓글 작성
export async function addNewComment(commentText, userId, productId, userPhotoUrl, userName) {


    const currentDate = new Date();
    // 날짜 -> yyyy/mm/dd 형식으로 변환 -> 2023/11/15
    const formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    // 시간 -> hh:mm 형식으로 변환 -> 01:30
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;


    // newCommentRef -> 데이터베이스 댓글 저장 위치
    const newCommentRef = push(ref(database, 'comments'));
    // commentId -> 댓글 고유 키 ->  firebase의 push함수 -> 새 데이터를 추가할 때마다 고유 키 생성 -> newCommentRef 레퍼런스에 대한 고유 키
    const commentId = newCommentRef.key;

    // newCommentData -> 새 댓글 정보 객체
    const newCommentData = {
        id: commentId,
        text: commentText,
        userId: userId,
        productId: productId,  
        date: `${formattedDate} ${formattedTime}`,
        userPhotoUrl: userPhotoUrl,
        userName: userName,
    };


    // newCommentRef(댓글 저장 위치)에 -> newCommentData(새 댓글 정보 객체) 저장
    await set(newCommentRef, newCommentData);
}


// 댓글 읽어오기
export async function getCommentsByProductId(productId) {

    // 댓글 배열
    const commentData = [];

    try 
    {
        // snapshot -> 댓글 경로(ref)에서 값 가져오기(get)
        const snapshot = await get(ref(database, 'comments'));

        if(snapshot.exists())
        {
            snapshot.forEach((commentSnapshot) => {
                
                // comment 값 추출 -> val()
                const comment = commentSnapshot.val();
                
                // 댓글 경로의 productId -> 현재 페이지 productId -> 일치
                if(comment.productId === productId)
                {
                    // productId가 일치하는 댓글 -> commentData 배열에 추가 
                    commentData.push(comment);
                }
            });
        }
        
        // commentData -> 댓글 데이터 배열 -> 반환
        return commentData;
    
    } 
    
    catch(error) 
    {
        console.error(error);
    }
}


// 댓글 삭제
export async function deleteComment(commentId) {
    try {
        await remove(ref(database, `comments/${commentId}`));
        console.log('댓글이 성공적으로 삭제됨');
    } catch(error) {
        console.error(error);
    }
}


// 댓글 수정
export async function updateComment(commentId, updatedText) {

    const commentRef = ref(database, `comments/${commentId}`);

    try {
        await update(commentRef, { text: updatedText });
        console.log('댓글이 성공적으로 수정됨');
    } catch(error) {
        console.error(error);
    }

}


// 댓글 좋아요
export async function likeComment(commentId, userId) {
    await set(ref(database, `likes/${commentId}/${userId}`), true);
    await update(ref(database, `comments/${commentId}`), { likes: increment(1) }); 
}



// 내가 등록한 제품 삭제
export async function removeMyProducts(productId) {

    return remove(ref(database, `products/${productId}`));
}

// 내가 등록한 상품과 동일한 장바구니 상품 삭제
export async function removeProductAndCartData(userId, productId) {

    try {
        // 상품 삭제
        await removeMyProducts(productId);

        // 장바구니에서 상품 삭제
        await removeFromCart(userId, productId);
         
    } catch(error) {
        console.error(error);
    }
}