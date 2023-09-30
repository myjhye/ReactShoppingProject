import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, get, remove, equalTo, query, orderByChild, update, push, increment } from 'firebase/database';
import { v4 as uuid } from 'uuid';

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
 



// 회원가입
export async function signUpWithEmailandPassword(email, password, displayName, photoURL) {

    // 회원가입 처리
    try {
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // 사용자 프로필 업데이트 => 닉네임, photoURL 데이터 넘기기
        await updateProfile(userCredential.user, { displayName, photoURL});

        return { 
            success: true,
        }

    
    // 유효성 검사
    } catch (error) {
        
        let message = '';

        if (error.code === 'auth/email-already-in-use') {
            
            message = '이미 사용 중인 이메일입니다.'
            return {
                success: false,
                message: message
            };

        } else {
            throw error; // 다른 오류는 다시 throw하여 처리하도록 수정
        }
    }
}

// 이메일, 패스워드로 로그인
export async function loginWithEmailandPassword(email, password) {

    try {
        await signInWithEmailAndPassword(auth, email, password)

        return {
            success: true,
        }

    } catch(error) {
        let message = '';
        
        if(error.code === 'auth/wrong-password') {
            message = '비밀번호가 틀립니다.'
        }
        else if(error.code === 'auth/user-not-found') {
            message = '존재하지 않는 이메일입니다.'
        }
        
        return {
            success: false,
            message
        }
    }
}


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



// (1)사용자 로그인 상태 변화를 감지하고, (2)관리자 여부를 확인하는 함수
export function onUserStateChange(callback) {

    // firebase authentication에서 사용자의 로그인 상태 변화를 감지하는 함수
    onAuthStateChanged(auth, async(user) => {

        // 만약 사용자가 로그인 했으면 사용자 정보 업데이트하고 관리자 여부 확인
        const updatedUser = user ? await adminUser(user) : null;

        // 콜백함수에 업데이트된 사용자 정보 전달
        callback(updatedUser);
    });
}


// 주어진 사용자가 관리자인지 확인하고 관리자 여부를 추가하여 반환하는 함수
function adminUser(user) {

    // firebase의 realtime database에서 'admins' 경로에 저장된 관리자 정보를 조회
    return get(ref(database, 'admins'))
        .then((snapshot) => {

            // 만약 관리자 정보가 존재하면
            if(snapshot.exists()) {
                
                // 관리자 정보를 객체로 변환하여 가져옴
                const admins = snapshot.val(); // .val() : 값 가져오기
                
                // 사용자의 고유 식별자(uid)가 관리자 목록(admins)에 포함 되어 있는지 확인
                const isAdmin = admins.includes(user.uid); // true/false로 반환

                // 사용자 정보 업데이트 해서 관리자 여부(isAdmin) 추가하고 반환
                return {
                    ...user, // 기존 사용자 정보
                    isAdmin // isAdmin 필드 추가
                }
            }
            return user;
        })
}






///////////////////// 제품


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




// 제품 검색
export async function searchProductByName(name) {
    
    try 
    {
        // 'products' 경로에 대한 참조 생성
        const productsRef = ref(database, 'products');

        // 이름을 기준으로 제품을 정렬하는 쿼리 생성
        const queryRef = query(
            productsRef,
            orderByChild('title')
        );

        // 쿼리 실행하여 결과 가져오기
        const querySnapshot = await get(queryRef);

        const results = [];

        // 쿼리 결과를 반복하며 제품을 검색하여 results 배열에 추가
        querySnapshot.forEach((doc) => { // doc: product의 전체 데이터
            const productTitle = doc.child('title').val();
            if (productTitle.includes(name)) {
                results.push(doc.val());
            }
        });

        // 검색 결과 반환
        return results;
    } 
    catch (error) 
    {
        console.error('Error searching products by name:', error);
        // 오류 발생 시 빈 배열 반환
        return [];
    }
}








////////////////// 장바구니


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







////////////////// 댓글

// 댓글 작성
export async function addNewComment(commentText, userId, productId, userPhotoUrl, userName) {

    const commentRef = ref(database, 'comments');

    const newCommentRef = push(commentRef);
    const commentId = newCommentRef.key;

    const currentDate = new Date();
    // 날짜를 yyyy/mm/dd 형식으로 변환
    const formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    // 시간을 hh:mm 형식으로 변환
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

    const newCommentData = {
        id: commentId,
        text: commentText,
        userId: userId,
        productId: productId,  
        date: `${formattedDate} ${formattedTime}`,
        userPhotoUrl: userPhotoUrl,
        userName: userName,
    };

    await set(newCommentRef, newCommentData);
}


// 댓글 읽어오기
export async function getCommentsByProductId(productId) {

    const commentRef = ref(database, 'comments');

    try {

        const snapshot = await get(commentRef);
        const commentData = [];

        if(snapshot.exists())
        {
            snapshot.forEach((commentSnapshot) => {
                
                const comment = commentSnapshot.val();
                
                if(comment.productId === productId)
                {
                    commentData.push(comment);
                }
            });
        }
        
        return commentData;
    
    } catch(error) {
        console.error(error);
    }
}


// 댓글 삭제
export async function deleteComment(commentId) {

    const commentRef = ref(database, `comments/${commentId}`);

    try {
        await remove(commentRef);
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

    const likesRef = ref(database, `likes/${commentId}/${userId}`);
    await set(likesRef, true);

    const commentRef = ref(database, `comments/${commentId}`);
    await update(commentRef, { likes: increment(1) }); 
    
}




// 댓글 싫어요
export async function dislikeComment(commentId, userId) {

    const dislikesRef = ref(database, `dislikes/${commentId}/${userId}`);
    await set(dislikesRef, true);

    const commentRef = ref(database, `comments/${commentId}`);
    await update(commentRef, { dislikes: increment(1) }); 
}







////////////////// 북마크


// 상품 북마크 추가
export async function addBookmark(userId, product) {

    return set(ref(database, `bookmarks/${ product.id }/${ userId }`), product);
}


// 상품 북마크 데이터 읽어오기
export async function getBookmarks(productId) {

    return get(ref(database, `bookmarks/${ productId }`))
        .then((snapshot) => {
            const items = snapshot.val() || {};
            return Object.values(items);
        })
}



// 북마크 삭제
export async function removeBookmark(productId, userId) {

    return remove(ref(database, `bookmarks/${ productId }/${ userId }`));
}








///////////////////// 문의 사항



// 문의 사항 작성
export default function addHelpInquiry(title, content, imageUrl, userId) {

    const id = uuid();
    const currentDate = new Date();
    // 날짜를 yyyy/mm/dd 형식으로 변환
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    // 시간을 hh:mm 형식으로 변환
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

    set(ref(database, `help/${ id }`), {
        id: id,
        title: title,
        content: content,
        imageUrl: imageUrl,
        userId: userId,
        date: `${formattedDate} ${formattedTime}`,
    });
}




// 문의 사항 읽어오기
export async function getHelpInquiry() {
    
    return get(ref(database, `help`))
        .then((snapshot) => {
            const items = snapshot.val() || {};
            return Object.values(items);
        })
}



// 문의 사항 댓글 작성
export async function addHelpComment(helpInquiryId, helpCommentText, userId, userPhotoUrl, userName) {

    const helpCommentId = uuid();
    const helpCommentRef = ref(database, `helpComments/${helpCommentId}`);

    const currentDate = new Date();

    // 날짜를 yyyy/mm/dd 형식으로 변환
    const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = (currentDate.getDate()).toString().padStart(2, '0');
    const formattedDate = `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
    
    // 시간을 hh:mm 형식으로 변환
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;


    const newHelpCommentData = {
        helpCommentId: helpCommentId,
        helpInquiryId: helpInquiryId,  
        text: helpCommentText,
        userId: userId,
        date: `${formattedDate} ${formattedTime}`,
        userPhotoUrl: userPhotoUrl,
        userName: userName,
    };

    await set(helpCommentRef, newHelpCommentData);


}



// 문의사항 댓글 읽어오기
export async function getHelpCommentsByHelpId(helpId) {

    const helpCommentRef = ref(database, 'helpComments');

    try {
        const snapshot = await get(helpCommentRef);
        const helpCommentData = [];

        if(snapshot.exists()) 
        {
            snapshot.forEach((helpCommentSnapshot) => {

                const helpComment = helpCommentSnapshot.val();

                if(helpComment.helpInquiryId === helpId) {
                    helpCommentData.push(helpComment);
                }
            });
        }

        return helpCommentData;

    } catch (error) {
        console.error(error);
    }
}



// 문의사항 댓글 삭제
export async function deleteHelpComment(helpCommentId) {

    const helpCommentRef = ref(database, `helpComments/${helpCommentId}`);

    try {
        await remove(helpCommentRef);
    } catch (error) {
        console.error(error);
    }
}
