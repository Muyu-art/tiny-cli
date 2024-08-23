<template>
  <div class="login-form-container">
    <tiny-form
      ref="loginFormMail"
      :model="loginMail"
      class="login-form"
      :rules="rules"
      validate-type="text"
      label-width="0"
      size="medium"
    >
      <tiny-form-item prop="mailname" size="medium">
        <tiny-input
          v-model="loginMail.mailname"
          :placeholder="$t('login.form.mailName.placeholder')"
        >
        </tiny-input>
      </tiny-form-item>

      <tiny-form-item prop="mailpassword" size="medium">
        <tiny-input
          v-model="loginMail.mailpassword"
          type="password"
          show-password
          :placeholder="$t('login.form.mailpassword.placeholder')"
        >
        </tiny-input>
      </tiny-form-item>

      <div class="login-form-options">
        <tiny-checkbox>{{ $t('login.form.rememberPassword') }}</tiny-checkbox>
        <div>
          <tiny-link type="primary">
            {{ $t('login.form.forgetPassword') }}
          </tiny-link>
          <tiny-link type="primary" class="divide-line">|</tiny-link>
          <tiny-link type="primary" @click="typeChange">
            {{ $t('login.form.registration') }}
          </tiny-link>
        </div>
      </div>

      <tiny-form-item size="medium">
        <tiny-button
          type="primary"
          class="login-form-btn"
          :loading="loading"
          @click="handleSubmit"
          >{{ $t('login.form.login') }}</tiny-button
        >
      </tiny-form-item>
    </tiny-form>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, reactive, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from '@/router';
import {
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Button as TinyButton,
  Checkbox as TinyCheckbox,
  Link as TinyLink,
  Modal,
  Notify,
} from '@opentiny/vue';
import { useI18n } from 'vue-i18n-composable';
import { useUserStore } from '@/stores/user';
import { useMenuStore } from '@/stores/modules/router';
import useLoading from '@/hooks/loading';
import { toRoutes } from '@/router/guard/menu';
import { useLocales } from '@/stores/modules/locales';

const userStore = useUserStore();
const userMenu = useMenuStore();
const { t } = useI18n();
const instance = getCurrentInstance()?.proxy;
const router = useRouter();
const { loading, setLoading } = useLoading();
const loginFormMail = ref();
const rules = {
  mailname: [
    {
      required: true,
      message: t('login.form.mailName.errMsg'),
      trigger: 'change',
    },
  ],
  mailpassword: [
    {
      required: true,
      message: t('login.form.mailpassword.errMsg'),
      trigger: 'change',
    },
  ],
};

const loginMail = reactive({
  mailname: 'admin@no-reply.com',
  mailpassword: 'admin',
  rememberPassword: true,
});

// 切换模式
const handle: any = inject('handle');
const typeChange = () => {
  handle(true);
};
const localeStore = useLocales();

function handleSubmit() {
  loginFormMail.value?.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }

    setLoading(true);

    try {
      await userStore.login({
        email: loginMail.mailname,
        password: loginMail.mailpassword,
      });
      Modal.message({
        message: t('login.form.login.success'),
        status: 'success',
      });
      const { redirect, ...othersQuery } = router.currentRoute.query;
      const menuStore = useMenuStore();
      if (!menuStore.menuList.length) {
        const data = await menuStore.getMenuList();
        const routes = toRoutes(data);
        routes.forEach((route) => router.addRoute('root', route));
      }
      const redirectTo =
        redirect && redirect.toString().toLowerCase() === 'login'
          ? 'Home'
          : redirect ?? 'Home';
      const route = router
        .getRoutes()
        .filter((route) => route.name === redirectTo)[0];
      if (!route) {
        const firstRoute = router.getRoutes().filter((route) => {
          return (
            route.path !== '' &&
            !route.path.includes('login') &&
            !route.path.includes('preview') &&
            !route.path.includes('404') &&
            route.path !== '/vue-pro'
          );
        })[0];
        if (firstRoute) {
          router.replace({ path: firstRoute.path });
          return;
        }
        Notify({
          type: 'error',
          title: t('login.route.error'),
          position: 'top-right',
          duration: 2000,
        });
      } else {
        router.replace({ path: route.path });
        await localeStore.fetchLocalTable();
        const entries = Object.entries(localeStore.localTable);
        for (let i = 0; i < entries.length; i += 1) {
          const key = entries[i][0];
          const messages = entries[i][1];
          instance?.$i18n.mergeLocaleMessage(key, messages);
        }
        localeStore.$patch({
          shouldMerge: false,
        });
      }
    } catch (err) {
      Notify({
        type: 'error',
        title: t('login.tip.right'),
        message: t('login.tip.mail'),
        position: 'top-right',
        duration: 2000,
        customClass: 'my-custom-cls',
      });
    } finally {
      setLoading(false);
    }
  });
}

onMounted(() => {
  userMenu.clearMenuList();
});
</script>

<style lang="less" scoped>
.login-form-container {
  margin-top: 5%;
}

.login-form {
  margin-left: 6%;

  .tiny-form-item {
    margin-bottom: 20px;
  }

  &-container {
    width: 320px;
  }

  &-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 12px;
  }

  &-btn {
    display: block;
    width: 100%;
    max-width: 100%;
  }
}

.divide-line {
  margin: 0 5px;
}
// responsive
@media (max-width: @screen-ms) {
  .login-form {
    margin-left: 5%;

    &-container {
      width: 240px;
    }
  }
}
</style>
