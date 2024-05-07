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

    
    try {
        // 회원가입 처리
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);


        // 사용자 프로필(userCredential.user) 업데이트 -> 유저 '닉네임, 프로필 사진' 데이터 넘기기
        await updateProfile(userCredential.user, { displayName, photoURL });


        // 회원가입 성공하면 success: true 반환
        return { 
            success: true,
        }

    
       
        
    
    } catch (error) {
        
        let message = '';


        // 유효성 검사 -> 이미 사용 중인 이메일
        if (error.code === 'auth/email-already-in-use') {
            
            message = '이미 사용 중인 이메일입니다.'

            return {
                success: false,
                message: message
            };

        } else {
            // 그 외 오류 처리
            console.error (error);
        }
    }
}





// 이메일, 패스워드로 로그인 -> 일반 로그인
export async function loginWithEmailandPassword(email, password) {

    try {

        // 로그인 처리
        await signInWithEmailAndPassword(auth, email, password)



        // 로그인 성공 여부 -> 성공
        return {
            success: true,
        }



    // 로그인 실패    
    } catch(error) {
        
        let message = '';
        

        // 로그인 실패 원인 메세지 설정
        if(error.code === 'auth/wrong-password') {
            message = '비밀번호가 틀립니다.'
        }
        else if(error.code === 'auth/user-not-found') {
            message = '존재하지 않는 이메일입니다.'
        }
        

        // 로그인 성공 여부 -> 실패 & 로그인 실패 원인 메세지        
        return {
            success: false,
            message
        }
    }
}





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


// 새 제품 등록
export async function addNewProduct(id, product, imageUrl, userId) {

    // 현재 시간
    const currentDate = new Date();

    // 상품을 데이터베이스에 추가
    set(ref(database, `products/${ id }`), {
        

        // 기존 상품 정보 가져옴 -> 기존 상품 정보를 유지하면서 새 정보를 추가하려고
        ...product,

        
        // 추가하려는 정보 -> 고유상품id, 사용자id, 가격(문자열 -> 정수), 이미지url, 등록날짜 
        id: id,
        uid: userId,
        price: parseInt(product.price),
        image: imageUrl,
        date: currentDate.toISOString(),
    })
}





// 모든 제품 읽어오기
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

    await set(ref(database, `likes/${commentId}/${userId}`), true);

    await update(ref(database, `comments/${commentId}`), { likes: increment(1) }); 
    
}




// 댓글 싫어요
export async function dislikeComment(commentId, userId) {

    const dislikesRef = ref(database, `dislikes/${commentId}/${userId}`);
    await set(dislikesRef, true);

    const commentRef = ref(database, `comments/${commentId}`);
    await update(commentRef, { dislikes: increment(1) }); 
}







//--------------------- 문의 사항



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



// 문의사항 댓글 수정
export async function updateHelpComment(helpCommentId, updatedText) {

    const helpCommentRef = ref(database, `helpComments/${helpCommentId}`);

    try {
        await update(helpCommentRef, { text: updatedText });
    } catch (error) {
        console.log (error);
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






//--------------------- 내가 등록한 제품



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



// 내가 등록한 제품 정보 수정
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







//--------------------- 내가 등록한 댓글



// 내가 등록한 댓글 조회
export async function getMyComments(userId) {

    const commentsRef = ref(database, `comments`);
    const userCommentsQuery = query(commentsRef, orderByChild('userId'), equalTo(userId));

    const snapshot = await get(userCommentsQuery);
    const items = snapshot.val() || {};

    // Convert the object to an array of values
    const commentList = Object.values(items);

    return commentList;
}



export async function getProductData(productId) {
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);
    return snapshot.val();
}



export async function getMyCommentsWithProductData(userId) {
    const comments = await getMyComments(userId); // 사용자의 댓글 목록을 가져옵니다.

    // 각 댓글에 대한 상품 제목을 가져옵니다.
    const commentsWithProductData = await Promise.all(
        comments.map(async (comment) => {
            const productData = await getProductData(comment.productId);
            return {
                ...comment,
                productData,
            };
        })
    );

    return commentsWithProductData;
}




// 내가 작성한 댓글 삭제
export async function deleteMyComments(commentId) {

    const commentRef = ref(database, `comments/${commentId}`);

    try {
        await remove(commentRef);
        return true;
    } catch (error)  {
        console.log (error);
        return false;
    }
}